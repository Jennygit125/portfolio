import multer from 'multer';

// Keep files in memory as Buffers
const storage = multer.memoryStorage();

// Export the customized configuration (allowing max 10 images at once)
export const uploadi = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit files to 5MB max each
  }
});
