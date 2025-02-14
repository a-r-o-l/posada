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
  folder: string,
  mimeType: string
) {
  const key = `${folder}/${filename}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
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
    const formData = await request.formData();

    const folder = formData.get("folder") as string;

    const files: { name: string; buffer: Buffer; mimeType: string }[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("file") && value instanceof Blob) {
        const arrayBuffer = await value.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = value.type;
        files.push({ name: (value as File).name, buffer, mimeType });
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { message: "Las imágenes son requeridas" },
        { status: 400 }
      );
    }

    const imageUrls: string[] = [];
    for (const file of files) {
      const imageUrl = await uploadFileToS3(
        file.buffer,
        file.name,
        folder,
        file.mimeType
      );
      imageUrls.push(imageUrl);
      await delay(1000);
    }

    return NextResponse.json({ success: true, imageUrls });
  } catch (error) {
    console.error("Error al subir las imágenes:", error);
    return NextResponse.json({
      success: false,
      error: "Error al subir las imágenes",
    });
  }
}
