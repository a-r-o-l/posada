import React from "react";
import SignUpForm from "./components/SignUpForm";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4">
      <div
        style={{ backgroundImage: "url(/logoposada.png)" }}
        className="w-40 h-20 bg-cover bg-center"
      ></div>
      <SignUpForm />
    </div>
  );
}
