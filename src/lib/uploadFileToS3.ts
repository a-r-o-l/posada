import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});
export async function uploadFileToS3(
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

export async function deleteFileFromS3(filename: string, folder: string) {
  try {
    const key = `${folder}/${filename}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    };
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    return {
      success: true,
      message: `El archivo ${filename} fue eliminado correctamente`,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error al eliminar el archivo del bucket, intente nuevamente",
    };
  }
}
