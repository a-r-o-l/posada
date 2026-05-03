import React from "react";
import MyAccountClientSide from "./components/MyAccountClientSide";
import AccountNav from "./components/AccountNav";

function page() {
  return (
    <div className="py-10 container mx-auto">
      <AccountNav value="account" />
      <div className="mt-5">
        <MyAccountClientSide />
      </div>
    </div>
  );
}

export default page;
