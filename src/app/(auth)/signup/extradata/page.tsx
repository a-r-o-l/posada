import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import ExtraUserDataForm from "../components/ExtraUserDataForm";
import { getAccount } from "@/server/accountAction";
import { getAllSchools } from "@/server/schoolAction";
import { getAllGradesBySchool } from "@/server/gradeAction";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ account: string; school: string }>;
}) {
  const params = await searchParams;
  const accountParam = params.account;

  const { account } = await getAccount(accountParam);

  if (!account) {
    return <div>Account not found</div>;
  }

  const plainAccount = JSON.parse(JSON.stringify(account));
  const { schools } = await getAllSchools();
  const { grades } = await getAllGradesBySchool(params.school);

  return (
    <div className="container mx-auto">
      <div className="w-full flex justify-center">
        <div className="w-60">
          <AspectRatio ratio={1 / 1}>
            <Image
              src={"/posadalogowhite.png"}
              alt="Logo Posada"
              layout="fill"
              style={{ objectFit: "contain" }}
            />
          </AspectRatio>
        </div>
      </div>
      <ExtraUserDataForm
        user={plainAccount}
        schools={schools}
        grades={grades}
      />
    </div>
  );
}
