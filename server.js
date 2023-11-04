import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errHandler.js";
import authRouter from "./routes/authRoute.js";
import shelterRouter from "./routes/shelterRoute.js";
import './db/mongo.js'

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/data", shelterRouter)

app.use(errorHandler);

app.listen(PORT, console.log(`Server running on port ${PORT}`));
