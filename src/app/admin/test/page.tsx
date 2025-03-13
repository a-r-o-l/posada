"use client";

import { Input } from "@/components/ui/input";
import React from "react";
import * as XLSX from "xlsx";

function page() {
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: (string | number | boolean | null)[][] =
        XLSX.utils.sheet_to_json(sheet, { header: 1 });

      for (let i = 4; i < jsonData.length; i++) {
        const studentData = jsonData[i][0] as string;
        if (!studentData) continue;

        const [lastname, ...nameParts] = studentData.split(", ");
        const name = nameParts.join(" ").trim().toLowerCase();
        const lastnameLower = lastname.trim().toLowerCase();

        // Ignorar objetos donde name esté vacío
        if (!name) continue;

        const newStudent = {
          name: name,
          lastname: lastnameLower,
        };

        console.log("ns -> ", newStudent);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
    </div>
  );
}

export default page;
