import React from "react";
import CartItemsList from "./components/CartItemsList";
import BackButton from "./components/BackButton";

function page() {
  return (
    <div className="py-10 container mx-auto">
      <div className="flex">
        <BackButton />
      </div>
      <h1 className="text-3xl font-bold pl-12 mt-5 text-center">
        Detalles de tu compra
      </h1>
      <div className="mt-10">
        <CartItemsList />
      </div>
    </div>
  );
}

export default page;
