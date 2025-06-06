"use client";
import { Badge } from "@/components/ui/badge";
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

function OrderDetailClient({ sale }: { sale: ISalePopulated }) {
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
      (child) => child.schoolId.name
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
        startY + 20
      );
      doc.text(
        `Cliente: ${sale.accountId.lastname} ${sale.accountId.name}`,
        10,
        startY + 30
      );
      doc.text(`Email: ${sale.accountId.email}`, 10, startY + 40);
      doc.text(`Telefono: ${sale.accountId.phone}`, 10, startY + 50);
      doc.text(`Total: $${sale.total.toFixed(2)}`, 10, startY + 60);
      doc.text(
        `Estado: ${paymentStateParser(sale.status).text}`,
        10,
        startY + 70
      );

      let schoolStartY = 10 + 10;
      doc.setFontSize(12);
      doc.text("Colegios:", 110, schoolStartY); // Vuelto a "Colegios:"
      const colegiosTextWidth = doc.getTextWidth("Colegios:");
      doc.line(
        110,
        schoolStartY + 2,
        110 + colegiosTextWidth,
        schoolStartY + 2
      );
      // Mostrar colegios en la parte superior
      uniqueSchools.forEach((schoolName) => {
        schoolStartY += 8;
        doc.text(schoolName, 110, schoolStartY);
      });

      // Agregar menores en la parte superior (después de los colegios)
      schoolStartY += 10; // Espacio adicional antes de menores
      doc.text("Menores:", 110, schoolStartY);
      const menoresTextWidth = doc.getTextWidth("Menores:");
      doc.line(110, schoolStartY + 2, 110 + menoresTextWidth, schoolStartY + 2);

      schoolStartY += 8;

      // Mostrar cada niño en la parte superior
      sale.accountId.children.forEach((child) => {
        doc.text(
          `${child.name} ${child.lastname} - ${child.gradeId.grade} ${child.gradeId.division}`,
          110,
          schoolStartY
        );
        schoolStartY += 8;
      });

      // Agregar productos en una tabla
      const tableColumn = [
        "Archivo",
        "Producto",
        "Colegio",
        "Carpeta",
        "Precio",
        "Cantidad",
        "Importe",
      ];
      const tableRows: string[][] = [];

      products.forEach((product) => {
        const productData: string[] = [
          product?.fileTitle,
          product?.productId?.name,
          product?.fileId?.folderId?.schoolId?.name,
          product?.fileId?.folderId?.title,
          priceParserToString(product?.price),
          (product?.quantity).toString(),
          priceParserToString(product?.total),
        ];
        tableRows.push(productData);
      });

      autoTable(doc, {
        startY: startY + 80,
        head: [tableColumn],
        body: tableRows,
      });

      // Obtener posición final de la tabla
      const finalY = startY + 100;

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
      const textY = lineY + 20;

      // Calcular el centro de la página para centrar el texto
      const centerX = pageWidth / 2;

      // Agregar sección de colegios centrada
      doc.setFontSize(12);
      doc.text("Colegios", centerX, textY, { align: "center" });
      doc.line(
        centerX - colegiosTextWidth / 2,
        textY + 2,
        centerX + colegiosTextWidth / 2,
        textY + 2
      );

      // Mostrar colegios centrados
      let yPos = textY + 8;
      uniqueSchools.forEach((schoolName) => {
        doc.text(schoolName, centerX, yPos, { align: "center" });
        yPos += 8;
      });

      // Agregar menores centrados
      yPos += 10;
      doc.setFontSize(12);
      doc.text("Menores:", centerX, yPos, { align: "center" }); // Cambiado de "Menores a cargo:" a "Menores:"
      doc.line(
        centerX - menoresTextWidth / 2,
        yPos + 2,
        centerX + menoresTextWidth / 2,
        yPos + 2
      );
      yPos += 8;

      // Mostrar cada niño centrado
      sale.accountId.children.forEach((child) => {
        doc.text(
          `${child.name} ${child.lastname} - ${child.gradeId.grade} ${child.gradeId.division}`,
          centerX,
          yPos,
          { align: "center" }
        );
        yPos += 8;
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
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-center">Entrega</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{sale.order}</TableCell>
                    <TableCell>
                      {format(sale.createdAt!, "dd / MM / yyyy", {
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell>{sale?.accountId?.email}</TableCell>
                    <TableCell>${sale?.total?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        className={`w-24 text-center justify-center ${
                          paymentStateParser(sale?.status).color
                        } hover:${paymentStateParser(sale?.status).color}`}
                      >
                        {paymentStateParser(sale?.status).text}
                      </Badge>
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox checked={sale?.delivered} />
                    </TableCell>
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
    </Card>
  );
}

export default OrderDetailClient;
