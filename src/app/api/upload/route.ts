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
  const fileBuffer = buffer;
  const key = `${folder}/${filename}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: fileBuffer,
    ContentType: "image/jpeg",
  };
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return url;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const folder = formData.get("folder") as string;

    const files: File[] = [];
    formData.forEach((value, key) => {
      if (key.startsWith("file") && value instanceof File) {
        files.push(value);
      }
    });

    console.log("files -> ", files);

    if (files.length === 0) {
      return NextResponse.json(
        { message: "Las imágenes son requeridas" },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      console.log("uploadFileToS3 params -> ", buffer, file.name, folder);

      return uploadFileToS3(buffer, file.name, folder);
    });

    const imageUrls = await Promise.all(uploadPromises);

    return NextResponse.json({ success: true, imageUrls });
  } catch (error) {
    console.error("Error al subir las imágenes:", error);
    return NextResponse.json({
      success: false,
      error: "Error al subir las imágenes",
    });
  }
}
