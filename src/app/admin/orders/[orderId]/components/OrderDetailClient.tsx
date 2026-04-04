"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { paymentStateParser, priceParserToString } from "@/lib/utilsFunctions";
import { ISalePopulated } from "@/models/Sale";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Download } from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import TransferProofModal from "./TransferProofModal";
import { updateSale } from "@/server/saleAction";
import { toast } from "sonner";
import PaymentBadge from "@/app/store/purchases/components/PaymentBadge";
import { sendEmailToUserAfterApproveTransfer } from "@/server/emailsAction";

function OrderDetailClient({ sale }: { sale: ISalePopulated }) {
  const [proofModalOpen, setProofModalOpen] = React.useState(false);
  const [approving, setApproving] = React.useState(false);
  const [proofUrl, setProofUrl] = React.useState<string>("");

  const approveOrder = async () => {
    setApproving(true);
    try {
      const formData = new FormData();
      formData.append("status", "approved");
      const res = await updateSale(sale._id, formData);
      if (!res.success) {
        throw new Error(res.message);
      }
      await sendEmailToUserAfterApproveTransfer(sale);
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Orden aprobada correctamente");
      setProofModalOpen(false);
    } catch (err) {
      console.log(err);
      alert("Error al aprobar la orden");
    } finally {
      setApproving(false);
    }
  };
  const router = useRouter();
  const products = useMemo(() => {
    if (!sale) {
      return [];
    }
    return sale.products;
  }, [sale]);

  console.log("sale -> ", sale);

  const uniqueSchools = useMemo(() => {
    if (!sale?.accountId?.children?.length) {
      return [];
    }

    // Extraer todos los nombres de colegios
    const schoolNames = sale.accountId.children.map(
      (child) => child.schoolId.name,
    );

    // Eliminar duplicados usando Set
    return [...new Set(schoolNames)];
  }, [sale]);

  if (!sale) {
    return <></>;
  }

  const generatePDF = async () => {
    const doc = new jsPDF();
    autoTable(doc, {});

    // Función para convertir imagen a base64
    const getImageBase64 = (url: string): Promise<string | null> => {
      return new Promise((resolve) => {
        if (!url || url.trim() === "") {
          resolve(null);
          return;
        }

        const img = new Image();
        img.crossOrigin = "Anonymous";

        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const dataURL = canvas.toDataURL("image/png");
              resolve(dataURL);
            } else {
              resolve(null);
            }
          } catch (error) {
            console.error("Error convirtiendo imagen:", error);
            resolve(null);
          }
        };

        img.onerror = (error) => {
          console.error("Error cargando imagen:", url, error);
          resolve(null);
        };

        img.src = url;
      });
    };

    try {
      // Cargar logo
      const logoData = await getImageBase64("/logoposada.png");

      // Agregar logo si existe
      if (logoData) {
        doc.addImage(logoData, "PNG", 10, 10, 50, 30);
      }

      const startY = 50;

      // Título
      doc.setFontSize(18);
      doc.text("Detalles de la Orden", 10, startY);

      // Detalles de la orden
      doc.setFontSize(12);
      doc.text(`Orden: ${sale.order}`, 10, startY + 10);
      doc.text(
        `Fecha: ${format(new Date(sale.createdAt ?? ""), "dd / MM / yyyy", {
          locale: es,
        })}`,
        10,
        startY + 20,
      );
      doc.text(
        `Cliente: ${sale.accountId.lastname} ${sale.accountId.name}`,
        10,
        startY + 30,
      );
      doc.text(`Email: ${sale.accountId.email}`, 10, startY + 40);
      doc.text(`Teléfono: ${sale.accountId.phone}`, 10, startY + 50);
      doc.text(`Total: $${sale.total.toFixed(2)}`, 10, startY + 60);
      doc.text(
        `Estado: ${paymentStateParser(sale.status).text}`,
        10,
        startY + 70,
      );

      // Colegios y alumnos (parte superior derecha)
      let schoolStartY = 20;
      doc.setFontSize(12);
      doc.text("Colegio:", 110, schoolStartY);

      const uniqueSchools = [
        ...new Set(
          sale.accountId.children.map(
            (c) => c.schoolId?.name || c.gradeId?.schoolId?.name,
          ),
        ),
      ];
      uniqueSchools.forEach((schoolName) => {
        schoolStartY += 5;
        doc.text(schoolName, 110, schoolStartY);
      });

      schoolStartY += 10;
      doc.text("Alumno/s:", 110, schoolStartY);
      schoolStartY += 5;

      sale.accountId.children.forEach((child) => {
        const nombreApellido = `${child.name} ${child.lastname} - `;
        const gradoDivision = `${child.gradeId.grade} ${child.gradeId.division}`;
        const nombreApellidoWidth = doc.getTextWidth(nombreApellido);
        const gradoDivisionWidth = doc.getTextWidth(gradoDivision);

        doc.setFillColor(255, 255, 150);
        doc.rect(
          110 + nombreApellidoWidth,
          schoolStartY - 4,
          gradoDivisionWidth + 2,
          6,
          "F",
        );

        doc.setTextColor(0, 0, 0);
        doc.text(nombreApellido, 110, schoolStartY);
        doc.text(gradoDivision, 110 + nombreApellidoWidth, schoolStartY);
        schoolStartY += 5;
      });

      // Preparar tabla
      const tableColumn = [
        "Imagen",
        "Archivo",
        "Producto",
        "Colegio",
        "Carpeta",
        "Precio",
        "Cantidad",
        "Importe",
      ];

      // Cargar TODAS las imágenes ANTES de crear la tabla
      console.log("Cargando imágenes de productos...");
      const imagesBase64 = await Promise.all(
        products.map(async (product, index) => {
          if (product?.fileImageUrl && product.fileImageUrl.trim() !== "") {
            console.log(`Cargando imagen ${index + 1}:`, product.fileImageUrl);
            const base64 = await getImageBase64(product.fileImageUrl);
            if (base64) {
              console.log(`✅ Imagen ${index + 1} cargada correctamente`);
            } else {
              console.log(`❌ Imagen ${index + 1} NO se pudo cargar`);
            }
            return base64;
          }
          console.log(`❌ Producto ${index + 1} no tiene URL de imagen`);
          return null;
        }),
      );

      // Crear filas de la tabla
      const tableRows = products.map((product, index) => {
        return [
          "", // Celda vacía para la imagen (se dibujará manualmente)
          product?.fileTitle || "",
          product?.productId?.name || "",
          product?.fileId?.folderId?.schoolId?.name || "",
          product?.fileId?.folderId?.title || "",
          priceParserToString(product?.price) || "",
          (product?.quantity || 0).toString(),
          priceParserToString(product?.total) || "",
        ];
      });

      // Generar tabla
      autoTable(doc, {
        startY: startY + 80,
        head: [tableColumn],
        body: tableRows,
        didDrawCell: function (data) {
          // Solo procesar la columna de imágenes (índice 0)
          if (data.column.index === 0 && data.section === "body") {
            const rowIndex = data.row.index;
            const imageData = imagesBase64[rowIndex];

            // Limpiar el contenido de la celda (evitar texto extraño)
            if (data.cell.raw && typeof data.cell.raw === "string") {
              data.cell.text = [""];
            }

            if (imageData) {
              try {
                // Calcular dimensiones para la imagen
                const cellWidth = data.cell.width;
                const cellHeight = data.cell.height;
                const padding = 2;
                const maxWidth = cellWidth - padding * 2;
                const maxHeight = cellHeight - padding * 2;

                // Crear imagen temporal para obtener dimensiones reales
                const tempImg = new Image();
                tempImg.onload = () => {
                  const imgWidth = tempImg.width;
                  const imgHeight = tempImg.height;

                  // Calcular proporción
                  const ratio = Math.min(
                    maxWidth / imgWidth,
                    maxHeight / imgHeight,
                  );
                  const drawWidth = imgWidth * ratio;
                  const drawHeight = imgHeight * ratio;

                  // Centrar en la celda
                  const x = data.cell.x + (cellWidth - drawWidth) / 2;
                  const y = data.cell.y + (cellHeight - drawHeight) / 2;

                  try {
                    doc.addImage(imageData, "PNG", x, y, drawWidth, drawHeight);
                  } catch (err) {
                    console.error(
                      `Error dibujando imagen fila ${rowIndex + 1}:`,
                      err,
                    );
                  }
                };
                tempImg.src = imageData;
              } catch (error) {
                console.error(
                  `Error procesando imagen fila ${rowIndex + 1}:`,
                  error,
                );
              }
            }
          }
        },
        styles: {
          cellPadding: 5,
          fontSize: 10,
          minCellHeight: 40, // Altura mínima para que se vean bien las imágenes
          valign: "middle",
        },
        headStyles: {
          fillColor: [100, 100, 100],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 30, halign: "center", valign: "middle" }, // Imagen
          1: { cellWidth: 35 }, // Archivo
          2: { cellWidth: 25 }, // Producto
          3: { cellWidth: 30 }, // Colegio
          4: { cellWidth: 25 }, // Carpeta
          5: { cellWidth: 20, halign: "right" }, // Precio
          6: { cellWidth: 15, halign: "center" }, // Cantidad
          7: { cellWidth: 20, halign: "right" }, // Importe
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });

      // Obtener posición final de la tabla
      const finalY = (doc as any).lastAutoTable?.finalY || startY + 200;

      // Línea de corte
      const lineY = finalY + 30;
      const pageWidth = doc.internal.pageSize.width;
      doc.setLineDashPattern([3, 3], 0);
      doc.setDrawColor(0, 0, 0);
      doc.line(10, lineY, pageWidth - 10, lineY);
      doc.setLineDashPattern([], 0);

      // Información adicional
      const textY = lineY + 15;

      // Guardar PDF
      doc.save(`orden_${sale.order}.pdf`);

      console.log("✅ PDF generado exitosamente");
    } catch (error) {
      console.error("❌ Error al generar el PDF:", error);
      alert("Error al generar el PDF. Por favor, intente nuevamente.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center w-full justify-between">
          <Button
            className="rounded-full"
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft />
          </Button>
          <Button variant="outline" onClick={generatePDF}>
            <Download />
            Descargar
          </Button>
        </div>
        <CardTitle></CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-10">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la cuenta</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellido</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefono</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{sale?.accountId?.name}</TableCell>
                    <TableCell>{sale?.accountId?.lastname}</TableCell>
                    <TableCell>{sale?.accountId?.email}</TableCell>
                    <TableCell>{sale?.accountId?.phone}</TableCell>
                    <TableCell align="right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">Menores a cargo</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">
                                Menores a cargo
                              </h4>
                            </div>
                            <div>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Curso</TableHead>
                                    <TableHead>Colegio</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {sale?.accountId?.children?.map((child) => (
                                    <TableRow
                                      key={`${child.name}-${child.lastname}`}
                                    >
                                      <TableCell>
                                        {child.name} {child.lastname}
                                      </TableCell>
                                      <TableCell>
                                        {child.gradeId.grade}{" "}
                                        {child.gradeId.division}
                                      </TableCell>
                                      <TableCell>
                                        {child.schoolId.name}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalles de la orden</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Orden</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-center">Entrega</TableHead>
                    {sale.paymentTypeId === "transfer" && (
                      <TableHead>Comprobante</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{sale.order}</TableCell>
                    <TableCell>
                      {sale.paymentTypeId === "account_money"
                        ? "Efectivo"
                        : sale.paymentTypeId === "transfer"
                          ? "Transferencia"
                          : "Tarjeta"}
                    </TableCell>
                    <TableCell>
                      {format(sale.createdAt!, "dd / MM / yyyy", {
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell>{sale?.accountId?.email}</TableCell>
                    <TableCell>${sale?.total?.toFixed(2)}</TableCell>
                    <TableCell>
                      <PaymentBadge
                        state={sale?.status || ""}
                        paymentTypeId={sale?.paymentTypeId || ""}
                        transferProofUrl={sale?.transferProofUrl || ""}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox checked={sale?.delivered} />
                    </TableCell>
                    {sale.paymentTypeId === "transfer" && (
                      <TableCell>
                        {sale.transferProofUrl ? (
                          <NextImage
                            src={sale.transferProofUrl || "/placeholderimg.jpg"}
                            alt="Comprobante de transferencia"
                            width={48}
                            height={48}
                            style={{
                              objectFit: "cover",
                              cursor: "pointer",
                              borderRadius: 8,
                              border: "1px solid #eee",
                            }}
                            onClick={() => {
                              setProofUrl(sale.transferProofUrl || "");
                              setProofModalOpen(true);
                            }}
                          />
                        ) : (
                          <span className="text-gray-400 text-lg font-bold">
                            -
                          </span>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Productos de la orden</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagen</TableHead>
                    <TableHead>Archivo</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead className="text-right">Importe</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <NextImage
                          src={product.fileImageUrl || "/placeholder.svg"}
                          alt={product.fileTitle}
                          width={50}
                          height={50}
                          className="rounded-md"
                        />
                      </TableCell>
                      <TableCell>{product?.fileTitle}</TableCell>
                      <TableCell>{product?.productId?.name}</TableCell>
                      <TableCell>$ {product?.price?.toFixed(2)}</TableCell>
                      <TableCell>{product?.quantity}</TableCell>
                      <TableCell align="right">
                        $ {product?.total?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <TransferProofModal
        isaproved={sale.status === "approved"}
        open={proofModalOpen}
        proofUrl={proofUrl}
        onClose={() => setProofModalOpen(false)}
        onApprove={approveOrder}
        approving={approving}
      />
    </Card>
  );
}

export default OrderDetailClient;
