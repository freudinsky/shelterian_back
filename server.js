import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errHandler.js";
import authRouter from "./routes/authRoute.js";
import shelterRouter from "./routes/shelterRoute.js";
import './db/mongo.js'
import adminRouter from "./routes/adminRoute.js";
import { upload } from "./middlewares/imageHandler.js";

const app = express();
const PORT = process.env.PORT;

app.use(
	cors({
		origin: ["http://localhost:5173/", "https://www.shelterian.com/"],
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json());
app.use(upload.array("images[]"));

app.use("/auth", authRouter);
app.use("/data", shelterRouter)
app.use("/admin", adminRouter)

app.use(errorHandler);

app.listen(PORT, console.log(`Server running on port ${PORT}`));
