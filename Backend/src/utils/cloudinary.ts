import cloudinary from 'cloudinary';
import fs from 'fs';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

export const uploadToCloudinary = (filePath: string, folder: string) => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      filePath,
      { folder },
      (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        fs.unlinkSync(filePath); // remove file from local
        if (err) reject(err);
        else resolve(result!);
      }
    );
  });
};
