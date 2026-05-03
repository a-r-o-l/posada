import React from "react";
import ChildrensClientSide from "./components/ChildrensClientSide";
import AccountNav from "../components/AccountNav";

function page() {
  return (
    <div className="py-10 container mx-auto">
      <AccountNav value="childrens" />
      <div className="mt-5">
        <ChildrensClientSide />
      </div>
    </div>
  );
}

export default page;
