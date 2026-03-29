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

  console.log("prods -> ", products);

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

    // Función para convertir imagen a base64 (maneja CORS silenciosamente)
    const getImageBase64 = (url: string): Promise<string | null> => {
      return new Promise((resolve) => {
        // Si es una imagen local (del dominio), debería funcionar
        if (url.startsWith("/") || url.includes(window.location.hostname)) {
          const img = new Image();
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
              resolve(null);
              console.log(error);
            }
          };
          img.onerror = () => resolve(null);
          img.src = url;
        } else {
          // Para imágenes externas (S3), intentamos sin mostrar errores
          const img = new Image();
          img.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL("image/png"));
              } else {
                resolve(null);
              }
            } catch (error) {
              resolve(null); // Fallo silencioso para CORS
              console.log(error);
            }
          };
          img.onerror = () => resolve(null); // Fallo silencioso para CORS
          img.src = url;
        }
      });
    };

    try {
      // Cargar la imagen desde la carpeta public y convertirla a base64
      const imgData = await getImageBase64("/logoposada.png");

      // Agregar imagen de la empresa
      doc.addImage(imgData as string, "PNG", 10, 10, 50, 30);

      // Ajustar la posición del título y otros elementos
      const startY = 50; // Ajusta este valor según sea necesario

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
      doc.text("Colegio:", 110, schoolStartY); // Vuelto a "Colegios:"
      // Mostrar colegios en la parte superior
      uniqueSchools.forEach((schoolName) => {
        schoolStartY += 5;
        doc.text(schoolName, 110, schoolStartY);
      });

      // Agregar menores en la parte superior (después de los colegios)
      schoolStartY += 10; // Espacio adicional antes de menores
      doc.text("Alumno/s:", 110, schoolStartY);

      schoolStartY += 5;

      // Mostrar cada niño en la parte superior
      sale.accountId.children.forEach((child) => {
        // Divide el texto en dos partes
        const nombreApellido = `${child.name} ${child.lastname} - `;
        const gradoDivision = `${child.gradeId.grade} ${child.gradeId.division}`;

        // Calcula el ancho del nombre y apellido
        const nombreApellidoWidth = doc.getTextWidth(nombreApellido);

        // Calcula el ancho del grado y división para el rectángulo
        const gradoDivisionWidth = doc.getTextWidth(gradoDivision);

        // Establece el color de fondo amarillo claro
        doc.setFillColor(255, 255, 150); // RGB para amarillo claro

        // Dibuja un rectángulo para el fondo de grado y división
        // El rectángulo es ligeramente más alto y ancho que el texto
        doc.rect(
          110 + nombreApellidoWidth, // Posición X después del nombre
          schoolStartY - 4, // Posición Y (un poco más arriba para que cubra todo el texto)
          gradoDivisionWidth + 2, // Ancho del texto + margen
          6, // Alto suficiente para cubrir el texto
          "F", // 'F' significa rellenar (fill)
        );

        // Restaura el color de texto a negro
        doc.setTextColor(0, 0, 0);

        // Ahora escribe el texto completo
        doc.text(nombreApellido, 110, schoolStartY);
        doc.text(gradoDivision, 110 + nombreApellidoWidth, schoolStartY);

        // Incrementa la posición Y para el siguiente niño
        schoolStartY += 5;
      });

      // Agregar productos en una tabla
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

      // Intentar cargar imágenes de productos
      console.log(
        "Productos con imágenes:",
        products.map((p) => ({
          title: p?.fileTitle,
          imageUrl: p?.fileImageUrl,
        })),
      );

      const imagePromises = products.map(async (product, index) => {
        if (product?.fileImageUrl) {
          console.log(
            `Intentando cargar imagen ${index + 1}:`,
            product.fileImageUrl,
          );
          const result = await getImageBase64(product.fileImageUrl);
          console.log(
            `Imagen ${index + 1}:`,
            result ? "Cargada exitosamente" : "Falló (probablemente CORS)",
          );
          return result;
        }
        return null;
      });

      const images = await Promise.all(imagePromises);
      const successfulImages = images.filter((img) => img !== null).length;
      console.log(
        `Se cargaron ${successfulImages} de ${products.length} imágenes`,
      );

      const tableRows: (
        | string
        | { content: string; styles: { cellPadding: number } }
      )[][] = [];

      products.forEach((product, index) => {
        const hasImage = images[index] !== null;
        const productData = [
          hasImage
            ? { content: "", styles: { cellPadding: 2 } }
            : `🖼️ ${product?.fileTitle || "Imagen"}`, // Mostrar nombre del archivo con ícono
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

      autoTable(doc, {
        startY: startY + 80,
        head: [tableColumn],
        body: tableRows,
        didDrawCell: function (data) {
          // Si es la columna de imagen (índice 0) y hay una imagen cargada
          if (data.column.index === 0 && data.section === "body") {
            const productIndex = data.row.index;
            const imageData = images[productIndex];

            if (imageData) {
              try {
                console.log(`Dibujando imagen para fila ${productIndex + 1}`);
                doc.addImage(
                  imageData as string,
                  "PNG",
                  data.cell.x + 2,
                  data.cell.y + 2,
                  data.cell.width - 4,
                  data.cell.height - 4,
                );
              } catch (error) {
                console.error(
                  `Error al dibujar imagen en fila ${productIndex + 1}:`,
                  error,
                );
              }
            }
          }
        },
        styles: {
          cellPadding: 5,
          fontSize: 10,
          minCellHeight: 20, // Altura mínima para mostrar imágenes
        },
        headStyles: {
          fillColor: [100, 100, 100],
          textColor: 255,
        },
        columnStyles: {
          0: { cellWidth: 20 }, // Imagen
          1: { cellWidth: 30 }, // Archivo
          2: { cellWidth: 25 }, // Producto
          3: { cellWidth: 30 }, // Colegio
          4: { cellWidth: 25 }, // Carpeta
          5: { cellWidth: 20 }, // Precio
          6: { cellWidth: 15 }, // Cantidad
          7: { cellWidth: 20 }, // Importe
        },
      });

      const finalY = startY + 160;

      // Agregar un espacio de 100px debajo de la tabla
      const lineY = finalY + 50;

      // Dibujar línea horizontal punteada (línea de corte)
      const pageWidth = doc.internal.pageSize.width;
      doc.setLineDashPattern([3, 3], 0); // Línea punteada
      doc.setDrawColor(0, 0, 0); // Color negro
      doc.line(10, lineY, pageWidth - 10, lineY); // Línea de un extremo a otro

      // Volver a línea sólida para otros elementos
      doc.setLineDashPattern([], 0);

      // Espacio después de la línea
      const textY = lineY + 10; // Aumentado de 10 a 20 para más espacio

      // Definir posiciones X para las dos columnas
      const leftX = 20; // Posición para "Colegios" (izquierda)
      const rightX = 100; // Posición para "Alumnos" (derecha)

      // COLUMNA IZQUIERDA - COLEGIOS
      // --------------------------
      doc.setFontSize(12);
      doc.text("Colegio:", leftX, textY);

      // Listar colegios
      let leftYPos = textY + 5;
      uniqueSchools.forEach((schoolName) => {
        doc.text(schoolName, leftX, leftYPos);
        leftYPos += 5;
      });

      // COLUMNA DERECHA - ALUMNOS
      // --------------------------
      doc.setFontSize(12);
      doc.text("Alumno/s:", rightX, textY);

      // Listar alumnos
      let rightYPos = textY + 5;
      sale.accountId.children.forEach((child) => {
        // Divide el texto en dos partes
        const nombreApellido = `${child.name} ${child.lastname} - `;
        const gradoDivision = `${child.gradeId.grade} ${child.gradeId.division}`;

        // Calcula el ancho del nombre y apellido
        const nombreApellidoWidth = doc.getTextWidth(nombreApellido);

        // Calcula el ancho del grado y división para el rectángulo
        const gradoDivisionWidth = doc.getTextWidth(gradoDivision);

        // Establece el color de fondo amarillo claro
        doc.setFillColor(255, 255, 150); // RGB para amarillo claro

        // Dibuja un rectángulo para el fondo de grado y división
        doc.rect(
          rightX + nombreApellidoWidth, // Posición X después del nombre
          rightYPos - 4, // Posición Y (un poco más arriba para que cubra todo el texto)
          gradoDivisionWidth + 2, // Ancho del texto + margen
          6, // Alto suficiente para cubrir el texto
          "F", // 'F' significa rellenar (fill)
        );

        // Restaura el color de texto a negro
        doc.setTextColor(0, 0, 0);

        // Ahora escribe el texto completo
        doc.text(nombreApellido, rightX, rightYPos);
        doc.text(gradoDivision, rightX + nombreApellidoWidth, rightYPos);

        // Incrementa la posición Y para el siguiente niño
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
