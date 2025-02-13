import { NextResponse, NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

async function uploadFileToS3(
  buffer: Buffer,
  filename: string,
  folder: string
) {
  const key = `${folder}/${filename}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: "image/jpeg",
  };
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return url;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  try {
    console.log("Inicio de la función POST");
    const formData = await request.formData();
    console.log("FormData recibido");

    const folder = formData.get("folder") as string;
    console.log("Folder:", folder);

    const files: File[] = [];
    formData.forEach((value, key) => {
      if (key.startsWith("file") && value instanceof File) {
        files.push(value);
      }
    });

    console.log("Archivos recibidos:", files.length);

    if (files.length === 0) {
      console.log("No se recibieron imágenes");
      return NextResponse.json(
        { message: "Las imágenes son requeridas" },
        { status: 400 }
      );
    }

    const imageUrls: string[] = [];
    for (const file of files) {
      console.log("Procesando archivo:", file.name);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const imageUrl = await uploadFileToS3(buffer, file.name, folder);
      console.log("Imagen subida:", imageUrl);
      imageUrls.push(imageUrl);
      await delay(1000); // Esperar 1 segundo entre cada subida
    }

    console.log("Todas las imágenes subidas con éxito");
    return NextResponse.json({ success: true, imageUrls });
  } catch (error) {
    console.error("Error al subir las imágenes:", error);
    return NextResponse.json({
      success: false,
      error: "Error al subir las imágenes",
    });
  }
}
