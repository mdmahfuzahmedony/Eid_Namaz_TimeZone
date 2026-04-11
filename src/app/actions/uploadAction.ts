"use server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      console.log("No file found in FormData");
      return null;
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "eid_timezone_masjids" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Error:", error); // এটি টার্মিনালে এরর দেখাবে
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    return result.secure_url;
  } catch (error) {
    console.error("Internal Server Error during upload:", error);
    return null;
  }
}