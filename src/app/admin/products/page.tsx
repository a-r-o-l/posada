import React from "react";
import ProductsClientSide from "./components/ProductsClientSide";
import { getSchools } from "@/supabase/hooks/server/schools";
import { getProductsBySchoolId } from "@/supabase/hooks/server/products";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ school: string }>;
}) {
  const search = await searchParams;
  const schools = await getSchools();
  const { data: products } = await getProductsBySchoolId(search.school);

  return (
    <div className="p-4 w-full">
      <ProductsClientSide
        schools={schools}
        selectedSchoolId={search.school}
        products={products}
      />
    </div>
  );
}
