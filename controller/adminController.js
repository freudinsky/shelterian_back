import bcrypt from "bcrypt";
import { uploadToCloudinary } from "../middlewares/imageHandler.js";
import Cats from "../models/Animals/Cats.js";
import Dogs from "../models/Animals/Dogs.js";
import Shelter from "../models/Shelter.js";
import ErrorResponse from "../utils/ErrResp.js";
import asyncHandler from "../utils/asyncHandler.js";

// GET

export const getMyAnimals = asyncHandler(async (req, res, next) => {
	const { uid } = req;
	const dogs = await Dogs.find({ shelter: uid }).sort({ timestamp: -1 });
	const cats = await Cats.find({ shelter: uid }).sort({ timestamp: -1 });

	res.status(201).json({ dogs: dogs, cats: cats });
});

export const getMyData = asyncHandler(async (req, res, next) => {
	const { uid } = req;

	const shelterData = await Shelter.findById(uid);
	res.status(201).json(shelterData);
});

// POST

export const createDog = asyncHandler(async (req, res, next) => {
	const { body, uid } = req;
	const files = req.files;
	let images = [];
	if (files) {
		try {
			images = await Promise.all(
				files.map(async (file, index) => {
					const cloudinaryResult = await uploadToCloudinary(
						file,
						`${body.name}${index}`
					);
					return cloudinaryResult.secure_url;
				})
			);
		} catch (error) {
			console.log(error);
			next(error);
		}
	}

	const newDog = await Dogs.create({
		...body,
		shelter: uid,
		images,
		timestamp: Date.now(),
	});
	const fullDogEntry = await Dogs.findById(newDog._id);
	res.status(201).json(fullDogEntry);
});

export const createCat = asyncHandler(async (req, res, next) => {
	const { body, uid } = req;
	const files = req.files;
	let images = [];
	if (files) {
		try {
			images = await Promise.all(
				files.map(async (file, index) => {
					const cloudinaryResult = await uploadToCloudinary(
						file,
						`${body.name}${index}`
					);
					return cloudinaryResult.secure_url;
				})
			);
		} catch (error) {
			console.log(error);
			next(error);
		}
	}

	const newCat = await Cats.create({
		...body,
		shelter: uid,
		images: images,
		timestamp: Date.now(),
	});
	const fullCatEntry = await Cats.findById(newCat._id);
	res.status(201).json(fullCatEntry);
});

// PUT

export const updateShelterData = asyncHandler(async (req, res, next) => {
	const { body, uid } = req;

	const shelterFind = await Shelter.findById(uid);
	if (!shelterFind) {
		throw new ErrorResponse("Entry does not exist.", 404);
	}
	const updatedData = await Shelter.findByIdAndUpdate(uid, body, { new: true });
	res.status(201).json(updatedData);
});

export const updatePassword = asyncHandler(async (req, res, next) => {
	const { oldPassword, newPassword, confirmPassword } = req.body;
	const uid = req.uid;

	const shelter = await Shelter.findById(uid).select("+password");

	if (!shelter) {
		throw new ErrorResponse("No entry", 404);
	}

	const passwordConfirm = await bcrypt.compare(oldPassword, shelter.password);

	if (!passwordConfirm) {
		throw new ErrorResponse("Incorrect Password!", 401);
	}

	if (newPassword !== confirmPassword) {
		throw new ErrorResponse("New passwords don't match.", 400);
	}
	const hashedPassword = await bcrypt.hash(newPassword, 10);

	shelter.password = hashedPassword;
	await shelter.save;

	res.status(201).json({ success: "Password updated." });
});

export const updateDog = asyncHandler(async (req, res, next) => {
	const {
		body,
		params: { id },
		uid,
	} = req;
	const foundDog = await Dogs.findById(id);
	const files = req.files;
	let newImages = [];
	if (files) {
		try {
			newImages = await Promise.all(
				files.map(async (file, index) => {
					const cloudinaryResult = await uploadToCloudinary(
						file,
						`${body.name}${index + foundDog.images.length}`
					);
					return cloudinaryResult.secure_url;
				})
			);
		} catch (error) {
			console.log(error);
			next(error);
		}
	}

	if (!foundDog) {
		throw new ErrorResponse("Entry does not exist.", 404);
	}
	if (uid != foundDog.shelter) throw new ErrorResponse("No permisson.", 401);

	const update = {
		$push: { images: { $each: newImages } },
		name: body.name,
		age: body.age,
		breed: body.breed,
		characteristics: body.characteristics,
		lastchanged: Date.now(),
	};

	const updatedDog = await Dogs.findByIdAndUpdate(id, update, {
		new: true,
	});
	res.status(201).json(updatedDog);
});

export const updateCat = asyncHandler(async (req, res, next) => {
	const {
		body,
		params: { id },
		uid,
	} = req;
	const foundCat = Cats.findById(id);
	const files = req.files;
	let newImages = [];
	if (files) {
		try {
			newImages = await Promise.all(
				files.map(async (file, index) => {
					const cloudinaryResult = await uploadToCloudinary(
						file,
						`${body.name}${index + foundCat.images.length}`
					);
					return cloudinaryResult.secure_url;
				})
			);
		} catch (error) {
			console.log(error);
			next(error);
		}
	}

	if (!foundCat) {
		throw new ErrorResponse("Entry does not exist.", 404);
	}
	if (uid !== foundCat.shelter.toString())
		throw new ErrorResponse("No permission.", 401);

	const update = {
		$push: { images: { $each: newImages } },
		name: body.name,
		age: body.age,
		breed: body.breed,
		characteristics: body.characteristics,
		lastchanged: Date.now(),
	};

	const updatedCat = await Cats.findByIdAndUpdate(id, update, { new: true });

	res.status(201).json(updatedCat);
});
