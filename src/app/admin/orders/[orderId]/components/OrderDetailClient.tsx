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

  console.log(sale);
  // Función para aprobar la orden
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

    // Función para convertir la imagen a base64
    const getImageBase64 = (url: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
          } else {
            reject(new Error("Failed to get 2D context"));
          }
        };
        img.onerror = (error) => reject(error);
        img.src = url;
      });
    };

    try {
      // Cargar la imagen del logo desde la carpeta public
      const imgData = await getImageBase64("/logoposada.png");

      // Agregar imagen de la empresa
      doc.addImage(imgData as string, "PNG", 10, 10, 50, 30);

      // Ajustar la posición del título y otros elementos
      const startY = 50;

      // Agregar título
      doc.setFontSize(18);
      doc.text("Detalles de la Orden", 10, startY);

      // Agregar detalles de la orden
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
      doc.text(`Telefono: ${sale.accountId.phone}`, 10, startY + 50);
      doc.text(`Total: $${sale.total.toFixed(2)}`, 10, startY + 60);
      doc.text(
        `Estado: ${paymentStateParser(sale.status).text}`,
        10,
        startY + 70,
      );

      let schoolStartY = 20;
      doc.setFontSize(12);
      doc.text("Colegio:", 110, schoolStartY);
      // Mostrar colegios en la parte superior
      uniqueSchools.forEach((schoolName) => {
        schoolStartY += 5;
        doc.text(schoolName, 110, schoolStartY);
      });

      // Agregar menores en la parte superior (después de los colegios)
      schoolStartY += 10;
      doc.text("Alumno/s:", 110, schoolStartY);

      schoolStartY += 5;

      // Mostrar cada niño en la parte superior
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

      // Cargar todas las imágenes de los productos ANTES de crear la tabla
      const imagesBase64 = await Promise.all(
        products.map(async (product) => {
          if (product?.fileImageUrl) {
            try {
              return await getImageBase64(product.fileImageUrl);
            } catch (error) {
              console.error(
                `Error cargando imagen para ${product.fileTitle}:`,
                error,
              );
              return null;
            }
          }
          return null;
        }),
      );

      // Definir columnas de la tabla (IMAGEN agregada al principio)
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

      // Crear filas de la tabla (la primera columna va vacía porque la imagen se dibuja aparte)
      const tableRows: string[][] = [];

      products.forEach((product) => {
        const productData: string[] = [
          "", // Celda vacía para la imagen (se dibujará manualmente)
          product?.fileTitle || "",
          product?.productId?.name || "",
          product?.fileId?.folderId?.schoolId?.name || "",
          product?.fileId?.folderId?.title || "",
          priceParserToString(product?.price) || "",
          (product?.quantity || 0).toString(),
          priceParserToString(product?.total) || "",
        ];
        tableRows.push(productData);
      });

      // Variable para guardar la posición Y final de la tabla
      let finalY = startY + 160;

      // Generar tabla con la función didDrawCell para dibujar las imágenes
      autoTable(doc, {
        startY: startY + 80,
        head: [tableColumn],
        body: tableRows,
        didDrawCell: function (data) {
          // Solo para la columna de imagen (índice 0) y en el cuerpo de la tabla
          if (data.column.index === 0 && data.section === "body") {
            const rowIndex = data.row.index;
            const imageData = imagesBase64[rowIndex];

            if (imageData) {
              try {
                // Calcular dimensiones para que la imagen quepa en la celda
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

                  // Calcular la proporción para que la imagen no se deforme
                  const ratio = Math.min(
                    maxWidth / imgWidth,
                    maxHeight / imgHeight,
                  );
                  const drawWidth = imgWidth * ratio;
                  const drawHeight = imgHeight * ratio;

                  // Centrar la imagen en la celda
                  const x = data.cell.x + (cellWidth - drawWidth) / 2;
                  const y = data.cell.y + (cellHeight - drawHeight) / 2;

                  doc.addImage(
                    imageData as string,
                    "PNG",
                    x,
                    y,
                    drawWidth,
                    drawHeight,
                  );
                };
                tempImg.src = imageData as string;
              } catch (error) {
                console.error("Error al dibujar imagen:", error);
              }
            }
          }
        },
        // Estilos de la tabla
        styles: {
          cellPadding: 5,
          fontSize: 10,
          minCellHeight: 30, // Altura mínima para que se vean bien las imágenes
        },
        headStyles: {
          fillColor: [100, 100, 100],
          textColor: 255,
        },
        columnStyles: {
          0: { cellWidth: 25 }, // Columna de imagen más angosta
          1: { cellWidth: 30 }, // Archivo
          2: { cellWidth: 25 }, // Producto
          3: { cellWidth: 30 }, // Colegio
          4: { cellWidth: 25 }, // Carpeta
          5: { cellWidth: 20 }, // Precio
          6: { cellWidth: 15 }, // Cantidad
          7: { cellWidth: 20 }, // Importe
        },
        // Callback para obtener la posición final después de dibujar la tabla
        didDrawPage: function (data) {
          // Actualizar finalY con la posición Y actual + la altura de la página si es necesario
          if (data.cursor) {
            finalY = data.cursor.y;
          }
        },
      });

      // Si no se actualizó finalY en didDrawPage, usar el valor por defecto
      // La línea de corte va después de la tabla
      const lineY = (finalY > startY + 160 ? finalY : startY + 160) + 30;

      // Dibujar línea horizontal punteada (línea de corte)
      const pageWidth = doc.internal.pageSize.width;
      doc.setLineDashPattern([3, 3], 0);
      doc.setDrawColor(0, 0, 0);
      doc.line(10, lineY, pageWidth - 10, lineY);

      // Volver a línea sólida para otros elementos
      doc.setLineDashPattern([], 0);

      // Espacio después de la línea
      const textY = lineY + 10;

      // Definir posiciones X para las dos columnas
      const leftX = 20;
      const rightX = 100;

      // COLUMNA IZQUIERDA - COLEGIOS
      doc.setFontSize(12);
      doc.text("Colegio:", leftX, textY);

      let leftYPos = textY + 5;
      uniqueSchools.forEach((schoolName) => {
        doc.text(schoolName, leftX, leftYPos);
        leftYPos += 5;
      });

      // COLUMNA DERECHA - ALUMNOS
      doc.setFontSize(12);
      doc.text("Alumno/s:", rightX, textY);

      let rightYPos = textY + 5;
      sale.accountId.children.forEach((child) => {
        const nombreApellido = `${child.name} ${child.lastname} - `;
        const gradoDivision = `${child.gradeId.grade} ${child.gradeId.division}`;
        const nombreApellidoWidth = doc.getTextWidth(nombreApellido);
        const gradoDivisionWidth = doc.getTextWidth(gradoDivision);

        doc.setFillColor(255, 255, 150);
        doc.rect(
          rightX + nombreApellidoWidth,
          rightYPos - 4,
          gradoDivisionWidth + 2,
          6,
          "F",
        );

        doc.setTextColor(0, 0, 0);
        doc.text(nombreApellido, rightX, rightYPos);
        doc.text(gradoDivision, rightX + nombreApellidoWidth, rightYPos);
        rightYPos += 5;
      });

      doc.save(`orden_${sale.order}.pdf`);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
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
