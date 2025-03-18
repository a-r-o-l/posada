import React from "react";
import SignInForm from "./components/SignInForm";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4">
      <div
        style={{ backgroundImage: "url(/logoposada.png)" }}
        className="w-40 h-20 bg-cover bg-center"
      ></div>
      <SignInForm />
    </div>
  );
}
