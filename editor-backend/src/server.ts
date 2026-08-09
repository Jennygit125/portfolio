import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/routes";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Define allowed origins in an array 
const allowedOrigins = [
  "https://bakreeniola.dev",
  "https://www.bakreeniola.dev", // Optional: include www if needed
  "http://localhost:3000",        // Optional: local development
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200, // Legacy browser support
};

// Handle preflight requests
app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan("dev"));

app.use("/", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});