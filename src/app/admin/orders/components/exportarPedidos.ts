// xlsx-js-style = la misma librería xlsx pero que también escribe colores
import * as XLSX from "xlsx-js-style";
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

// Color suave de fondo por colegio (gris si no se sabe o son varios)
const COLOR_COLEGIO: Record<string, string> = {
  moruli: "FFF4D6",
  "belgrano day school": "E3F1FB",
  "united high school": "FDE7E9",
  "stanford college": "EAF5E0",
  "florida day school": "F3E8F5",
  franklin: "FFEBD6",
};
const COLOR_ESTADO: Record<string, [string, string]> = {
  Pagado: ["2E7D32", "E8F5E9"],
  Pendiente: ["B26A00", "FFF3E0"],
  "En revisión": ["B26A00", "FFF3E0"],
  Rechazado: ["C62828", "FDECEA"],
};
const TINTA = "1F2A44";
const PESOS = '"$"#,##0'; // se ve $15.000 y sigue siendo número

// Encabezado azul de la marca, fila pintada por colegio, estado de color,
// plata con $, filtros y una fila de TOTAL al final.
const decorar = (hoja: XLSX.WorkSheet, plata: string[], sumar: string[]) => {
  const rango = XLSX.utils.decode_range(hoja["!ref"] || "A1");
  const celda = (r: number, c: number) => hoja[XLSX.utils.encode_cell({ r, c })];
  const titulos: string[] = [];
  for (let c = rango.s.c; c <= rango.e.c; c++) titulos.push(String(celda(0, c)?.v ?? ""));
  const iColegio = titulos.indexOf("Colegio");
  const iEstado = titulos.indexOf("Estado");
  const borde = { bottom: { style: "thin", color: { rgb: "D9DCE3" } } };

  titulos.forEach((_, c) => {
    const cel = celda(0, c);
    if (cel) cel.s = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: TINTA } } };
  });
  for (let r = 1; r <= rango.e.r; r++) {
    const colegio = String(celda(r, iColegio)?.v ?? "").toLowerCase();
    const fondo = COLOR_COLEGIO[colegio] ?? "F3F4F6";
    titulos.forEach((titulo, c) => {
      const cel = celda(r, c);
      if (!cel) return;
      cel.s = { fill: { fgColor: { rgb: fondo } }, border: borde };
      if (plata.includes(titulo) && typeof cel.v === "number") cel.z = PESOS;
      if (c === iEstado && COLOR_ESTADO[String(cel.v)]) {
        const [letra, fondoEstado] = COLOR_ESTADO[String(cel.v)];
        cel.s = { font: { bold: true, color: { rgb: letra } }, fill: { fgColor: { rgb: fondoEstado } }, border: borde };
      }
    });
  }
  const ultima = rango.e.r;
  hoja["!autofilter"] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: ultima, c: rango.e.c } }) };

  const total = ultima + 1;
  const estiloTotal = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: TINTA } } };
  titulos.forEach((titulo, c) => {
    const ref = XLSX.utils.encode_cell({ r: total, c });
    if (c === 0) hoja[ref] = { t: "s", v: "TOTAL", s: estiloTotal };
    else if (sumar.includes(titulo) && ultima >= 1) {
      const col = XLSX.utils.encode_col(c);
      hoja[ref] = { t: "n", f: `SUM(${col}2:${col}${ultima + 1})`, s: estiloTotal, ...(plata.includes(titulo) ? { z: PESOS } : {}) };
    } else hoja[ref] = { t: "s", v: "", s: estiloTotal };
  });
  hoja["!ref"] = XLSX.utils.encode_range({ s: rango.s, e: { r: total, c: rango.e.c } });
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

  const libro = XLSX.utils.book_new();
  const hoja1 = XLSX.utils.json_to_sheet(pedidos);
  hoja1["!cols"] = [14, 17, 24, 30, 15, 28, 16, 22, 60, 9, 11, 12, 22, 22, 13, 10].map(
    (wch) => ({ wch }),
  );
  const hoja2 = XLSX.utils.json_to_sheet(productos);
  hoja2["!cols"] = [14, 17, 12, 28, 16, 22, 34, 22, 9, 10, 11].map((wch) => ({ wch }));
  decorar(hoja1, ["Total"], ["Cantidad", "Total"]);
  decorar(hoja2, ["Precio", "Subtotal"], ["Cantidad", "Subtotal"]);
  XLSX.utils.book_append_sheet(libro, hoja1, "Pedidos");
  XLSX.utils.book_append_sheet(libro, hoja2, "Productos");

  const hoy = new Date().toLocaleDateString("es-AR").replace(/\//g, "-");
  XLSX.writeFile(libro, `Pedidos Fotos Posada ${hoy}.xlsx`);
  return pedidos.length;
};
