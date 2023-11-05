import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})

const uploadToCloudinary = (fileBuffer, fileName) => {
	return new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload_stream({ resource_type: "auto", public_id: fileName }, (error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			})
			.end(fileBuffer);
	});
};

export { upload, uploadToCloudinary };
