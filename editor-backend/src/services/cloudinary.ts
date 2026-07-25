import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a Multer file buffer to Cloudinary using streams.
 */
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string,
  publicIdPrefix: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: `${publicIdPrefix}-${Date.now()}`,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result || !result.secure_url) {
          return reject(new Error('Cloudinary upload failed: No secure URL returned.'));
        }
        resolve(result.secure_url);
      }
    );

   
    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;