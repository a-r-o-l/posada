import React from "react";
import { getAllSchools, getSchool } from "@/server/schoolAction";
import ProductsClientSide from "./components/ProductsClientSide";
import { getAllProductsById } from "@/server/productAction";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ school: string }>;
}) {
  const search = await searchParams;
  const { schools } = await getAllSchools();
  const { school } = await getSchool(search.school);
  const { products } = await getAllProductsById(search.school);

  return (
    <div className="p-4 w-full">
      <ProductsClientSide
        schools={schools}
        selectedSchool={school}
        products={products}
      />
    </div>
  );
}
