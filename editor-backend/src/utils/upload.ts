import cloudinary from '../services/cloudinary';


/**
 * Uploads a file buffer directly to Cloudinary using streams.
 * Includes a 30-second fail-safe timeout loop to prevent container hangs.
 */
export const uploadToCloudinary = (
  fileBuffer: Buffer, 
  folderName: string, 
  uploaderId: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 1. Establish an automatic 30-second timeout cutoff rule
    const timeout = setTimeout(() => {
      reject(new Error("Cloudinary connection request timed out after 30 seconds."));
    }, 30000);

    // 2. Initialize the physical binary stream wrapper
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: folderName,
        tags: [`user_${uploaderId}`], // Attaches the uploader ID as a searchable metadata tag
        timeout: 25000 // Instructs the underlying engine to drop safely if it hangs
      },
      (error, result) => {
        clearTimeout(timeout); // Clear the safety timer once it responds!
        
        if (error) {
          console.error("Cloudinary Stream Upload Error:", error);
          return reject(error);
        }
        
        // Return the secure cloud URL back to the controller
        resolve(result?.secure_url || "");
      }
    );

    // 3. Shove the binary buffer data cleanly down the pipe
    uploadStream.end(fileBuffer);
  });
};
