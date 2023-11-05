import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import asyncHandler from "../utils/asyncHandler.js";

const storage = multer.memoryStorage();
const fileName = (req, file, cb) => {
	const originalname = file.originalname;
	const filename = originalname.split(".")[0] + "_" + Date.now();
	cb(null, filename);
};

const upload = multer({
	storage: storage,
	filename: fileName,
});

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_KEY,
	api_secret: process.env.CLOUD_SECRET,
	secure: true,
});

const uploadToCloudinary = async (file, name) => {
	if (!file) {
		throw new Error("Datei ist nicht vorhanden in der Anfrage");
	}

	const b64 = Buffer.from(file.buffer).toString("base64");
	let dataURI = "data:" + file.mimetype + ";base64," + b64;
	const pubname = name
	//.split(".").slice(0, -1).join(".");

	const cloudinaryResult = await cloudinary.uploader.upload(dataURI, {
		resource_type: "auto",
		public_id: pubname,
	});
	return cloudinaryResult;
};

export { upload, uploadToCloudinary };
