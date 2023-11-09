import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errHandler.js";
import authRouter from "./routes/authRoute.js";
import shelterRouter from "./routes/shelterRoute.js";
import "./db/mongo.js";
import adminRouter from "./routes/adminRoute.js";
import { upload } from "./middlewares/imageHandler.js";

const app = express();
const PORT = process.env.PORT;

app.use(
	cors({
		origin: [process.env.CORS_LOCAL, process.env.CORS_ORIGIN],
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json());
app.use(upload.single("verifDoc"));

app.use("/auth", authRouter);
app.use("/data", shelterRouter);
app.use("/admin", adminRouter);

app.use(errorHandler);

app.listen(PORT, console.log(`Server running on port ${PORT}`));
