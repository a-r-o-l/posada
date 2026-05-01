"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ProductModal from "./ProductModal";
import { priceParserToString } from "@/lib/utilsFunctions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import { toast } from "sonner";
import ProductDropDownMenu from "./ProductDropDownMenu";
import { Product } from "@/supabase/models/product";
import { School } from "@/supabase/models/school";
import { useProducts } from "@/supabase/hooks/client/useProducts";
import { Check, X } from "lucide-react";

function ProductsClientSide({
  schools,
  selectedSchoolId,
  products,
}: {
  schools: School[];
  selectedSchoolId?: string;
  products: Product[];
}) {
  const { deleteProduct } = useProducts();
  const router = useRouter();
  const [productModal, setProductModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const selectedSchool = useMemo(() => {
    return schools.find((school) => school.id === selectedSchoolId);
  }, [selectedSchoolId, schools]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle>Productos</CardTitle>
        </div>
        <CardDescription>Ver y administrar productos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle>Lista de colegios</CardTitle>
              </div>
            </CardHeader>
            <Separator className="" />
            <CardContent>
              <ScrollArea className="h-[500px] py-10">
                {schools?.map((school) => (
                  <Button
                    key={school.id}
                    variant={
                      selectedSchool?.id === school.id ? "secondary" : "outline"
                    }
                    className="w-full justify-start text-left mb-2 py-10"
                    onClick={() => {
                      const currentUrl = new URL(window.location.href);
                      const params = new URLSearchParams(currentUrl.search);
                      params.set("school", school?.id || "");
                      router.push(
                        `${currentUrl.pathname}?${params.toString()}`,
                      );
                    }}
                  >
                    <Avatar>
                      <AvatarImage src={school.image_url} alt={school.name} />
                      <AvatarFallback></AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="font-semibold">{school.name}</div>
                      <div className="text-sm text-gray-500">{school.name}</div>
                    </div>
                  </Button>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle>Lista de productos</CardTitle>
                <Button
                  disabled={!selectedSchool}
                  onClick={() => setProductModal(true)}
                >
                  Crear producto
                </Button>
              </div>
            </CardHeader>
            <Separator className="" />
            <CardContent>
              <Table className="py-10">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripcion</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Descargable</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!!products?.length ? (
                    products.map((product) => (
                      <TableRow
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className={`${
                          selectedProduct?.id === product.id ? "bg-muted" : ""
                        } hover:cursor-pointer`}
                      >
                        <TableCell className="max-w-60 truncate">
                          {product.name}
                        </TableCell>
                        <TableCell className="max-w-60 truncate">
                          <p className="truncate">{product.description}</p>
                        </TableCell>
                        <TableCell>
                          $ {priceParserToString(product.price)}
                        </TableCell>
                        <TableCell>
                          {product.is_downloadable ? (
                            <Check className="text-green-500" />
                          ) : (
                            <X className="text-red-500" />
                          )}
                        </TableCell>
                        <TableCell className="text-end">
                          <ProductDropDownMenu
                            onDeleteClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(product);
                              setOpenDeleteAlert(true);
                            }}
                            onEditClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(product);
                              setProductModal(true);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-sm font-medium text-muted-foreground text-center h-60"
                      >
                        No hay productos
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <ProductModal
        open={productModal}
        onClose={() => {
          setProductModal(false);
          setSelectedProduct(null);
        }}
        school={selectedSchool}
        product={selectedProduct}
      />
      <CustomAlertDialog
        title="Eliminar producto"
        description="¿Estás seguro que deseas eliminar este producto?"
        open={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        onAccept={async () => {
          if (!selectedProduct) return;
          const res = await deleteProduct(selectedProduct.id);
          if (res.success) {
            toast.success(res.message);
            setOpenDeleteAlert(false);
          } else {
            toast.error(res.message);
          }
        }}
      />
    </Card>
  );
}

export default ProductsClientSide;
