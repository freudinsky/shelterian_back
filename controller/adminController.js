import Dogs from "../models/Animals/Dogs.js";
import Cats from "../models/Animals/Cats.js";
import Shelter from "../models/Shelter.js";
import ErrorResponse from "../utils/ErrResp.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";

// GET

export const getMyAnimals = asyncHandler(async (req, res, next) => {
	const { uid } = req;
	const dogs = await Dogs.find({ uid }).populate("shelter");
	const cats = await Cats.find({ uid }).populate("shelter");

	res.status(201).json({ dogs: dogs, cats: cats });
});

export const getMyData = asyncHandler(async(req, res, next) => {
	const {uid} = req;

	const shelterData = Shelter.findById(uid)

	res.status(201).json(shelterData)
} )

// POST

export const createDog = asyncHandler(async (req, res, next) => {
	const { body, uid } = req;

	const newDog = await Dogs.create({ ...body, shelter: uid });
	const fullDogEntry = await Dogs.findById(newDog._id).populate("shelter");
	res.status(201).json(fullDogEntry);
});

export const createCat = asyncHandler(async (req, res, next) => {
	const { body, uid } = req;

	const newCat = await Cats.create({ ...body, shelter: uid });
	const fullCatEntry = await Cats.findById(newCat._id).populate("shelter");
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

	const foundDog = Dogs.findById(id);

	if (!foundDog) {
		throw new ErrorResponse("Entry does not exist.", 404);
	}
	if (uid !== foundDog.shelter.toString())
		throw new ErrorResponse("No permisson.", 401);

	const updatedDog = await Dogs.findByIdAndUpdate(id, body, {
		new: true,
	}).populate("shelter");
	res.status(201).json(updatedDog);
});

export const updateCat = asyncHandler(async (req, res, next) => {
	const {
		body,
		params: { id },
		uid,
	} = req;

	const foundCat = Cats.findById(id);

	if (!foundCat) {
		throw new ErrorResponse("Entry does not exist.", 404);
	}
	if (uid !== foundCat.shelter.toString())
		throw new ErrorResponse("No permission.", 401);

	const updatedCat = await Cats.findByIdAndUpdate(id, body, {
		new: true,
	}).populate("shelter");
	res.status(201).json(updatedCat);
});
