import * as XLSX from "xlsx";
import { supabase } from "@/supabase/supabase";
import { SaleFullDetails } from "@/supabase/models/sale";

// Exporta a Excel los pedidos que se están viendo en el panel (con los
// mismos filtros). Hoja "Pedidos": una fila por orden. Hoja "Productos":
// una fila por producto, para armar el pedido al laboratorio.

const ESTADOS: Record<string, string> = {
  approved: "Pagado",
  pending: "Pendiente",
  in_process: "En revisión",
  rejected: "Rechazado",
  cancelled: "Cancelado",
  refunded: "Devuelto",
};

const MEDIOS: Record<string, string> = {
  credit_card: "Tarjeta de crédito",
  debit_card: "Tarjeta de débito",
  prepaid_card: "Tarjeta prepaga",
  account_money: "Dinero en Mercado Pago",
  transfer: "Transferencia",
  ticket: "Efectivo (Pago Fácil/Rapipago)",
};

interface Hijo {
  alumno: string;
  curso: string;
  colegio: string;
}

const buscarHijos = async (cuentas: string[]) => {
  const hijos: Record<string, Hijo[]> = {};
  for (let i = 0; i < cuentas.length; i += 100) {
    const { data } = await supabase
      .from("profile_students")
      .select(
        "profile_id, student:students(name, lastname, grade:grades(grade, year), school:schools(name))",
      )
      .in("profile_id", cuentas.slice(i, i + 100));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data || []).forEach((fila: any) => {
      const st = fila.student;
      if (!st) return;
      (hijos[fila.profile_id] ||= []).push({
        alumno: `${st.name ?? ""} ${st.lastname ?? ""}`.trim(),
        curso: [st.grade?.grade, st.grade?.year].filter(Boolean).join(" "),
        colegio: st.school?.name ?? "",
      });
    });
  }
  return hijos;
};

// En la base los productos de la venta vienen en snake_case (file_title),
// aunque el modelo diga fileTitle: se leen los dos.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const foto = (p: any): string => p?.file_title ?? p?.fileTitle ?? "";

const fecha = (valor: string | null) =>
  valor
    ? new Date(valor).toLocaleString("es-AR", {
        timeZone: "America/Argentina/Buenos_Aires",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

export const exportarPedidos = async (ventas: SaleFullDetails[]) => {
  const cuentas = [...new Set(ventas.map((v) => v.account_id).filter(Boolean))];
  const hijos = await buscarHijos(cuentas);
  const unir = (lista: string[]) => [...new Set(lista.filter(Boolean))].join(" / ");

  const pedidos = ventas.map((v) => {
    const h = hijos[v.account_id] || [];
    const productos = v.products || [];
    return {
      Orden: v.order,
      Fecha: fecha(v.created_at),
      Familia: `${v.profile?.name ?? ""} ${v.profile?.lastname ?? ""}`.trim(),
      Mail: v.profile?.email ?? "",
      Teléfono: v.profile?.phone ?? "",
      Alumno: unir(h.map((x) => x.alumno)),
      Curso: unir(h.map((x) => x.curso)),
      Colegio: unir(h.map((x) => x.colegio)),
      Productos: productos
        .map((p) => `${p.quantity}x ${String(p.name).trim()} (${foto(p)})`)
        .join("; "),
      Cantidad: productos.reduce((s, p) => s + (p.quantity || 0), 0),
      Total: v.total ?? 0,
      Estado: ESTADOS[v.status ?? ""] ?? v.status ?? "",
      "Medio de pago": MEDIOS[v.payment_type_id ?? ""] ?? v.payment_type_id ?? "",
      "Motivo (Mercado Pago)": v.status_detail ?? "",
      Transferencia: v.transfer_status ?? "",
      Entregado: v.delivered ? "Sí" : "No",
    };
  });

  const productos = ventas.flatMap((v) =>
    (v.products || []).map((p) => {
      const h = hijos[v.account_id] || [];
      return {
        Orden: v.order,
        Fecha: fecha(v.created_at),
        Estado: ESTADOS[v.status ?? ""] ?? v.status ?? "",
        Alumno: unir(h.map((x) => x.alumno)),
        Curso: unir(h.map((x) => x.curso)),
        Colegio: unir(h.map((x) => x.colegio)),
        Producto: String(p.name).trim(),
        Foto: foto(p),
        Cantidad: p.quantity,
        Precio: p.price,
        Subtotal: p.total,
      };
    }),
  );

  // La plata queda como número (se puede sumar) pero se ve "$15.000"
  const formatoPesos = (hoja: XLSX.WorkSheet, columnas: string[]) => {
    const rango = XLSX.utils.decode_range(hoja["!ref"] || "A1");
    for (let c = rango.s.c; c <= rango.e.c; c++) {
      const titulo = hoja[XLSX.utils.encode_cell({ r: 0, c })]?.v;
      if (!columnas.includes(titulo)) continue;
      for (let r = 1; r <= rango.e.r; r++) {
        const celda = hoja[XLSX.utils.encode_cell({ r, c })];
        if (celda && typeof celda.v === "number") celda.z = '"$"#,##0';
      }
    }
  };

  const libro = XLSX.utils.book_new();
  const hoja1 = XLSX.utils.json_to_sheet(pedidos);
  hoja1["!cols"] = [14, 17, 24, 30, 15, 28, 16, 22, 60, 9, 10, 12, 22, 22, 13, 10].map(
    (wch) => ({ wch }),
  );
  const hoja2 = XLSX.utils.json_to_sheet(productos);
  hoja2["!cols"] = [14, 17, 12, 28, 16, 22, 28, 22, 9, 10, 10].map((wch) => ({ wch }));
  formatoPesos(hoja1, ["Total"]);
  formatoPesos(hoja2, ["Precio", "Subtotal"]);
  XLSX.utils.book_append_sheet(libro, hoja1, "Pedidos");
  XLSX.utils.book_append_sheet(libro, hoja2, "Productos");

  const hoy = new Date().toLocaleDateString("es-AR").replace(/\//g, "-");
  XLSX.writeFile(libro, `Pedidos Fotos Posada ${hoy}.xlsx`);
  return pedidos.length;
};
