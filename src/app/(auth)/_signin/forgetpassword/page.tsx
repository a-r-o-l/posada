import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import React from "react";
import ForgetPasswordForm from "./components/ForgetPasswordForm";
import { getAccountByEmail } from "@/server/accountAction";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{
    email: string;
  }>;
}) {
  const { email } = await searchParams;

  const { account } = await getAccountByEmail(email);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-52 h-32 flex justify-center items-center ">
        <AspectRatio ratio={1 / 1}>
          <Image
            src={"/logoposada.png"}
            alt="Logo Posada"
            layout="fill"
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </AspectRatio>
      </div>
      <ForgetPasswordForm foundAccount={account} />
    </div>
  );
}
