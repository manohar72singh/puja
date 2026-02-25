import multer from "multer";
import path from "path";

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    // Use original name or add timestamp
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Export the multer instance
export const upload = multer({ storage });
