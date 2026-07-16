import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/routes";


import dotenv from "dotenv"


dotenv.config();

const app = express();



app.use(express.json());

app.use(morgan('dev'));

app.use("/", userRoutes);


// Uses the environment port, or defaults to 3000 if undefined
const PORT = process.env.PORT || 3000;

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running boy on port ${PORT}`);
});

