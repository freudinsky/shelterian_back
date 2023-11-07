import Shelter from "../models/Shelter.js";
import ErrorResponse from "../utils/ErrResp.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { geocodeAddress } from "../utils/geoCode.js";

//Registration

export const signUp = asyncHandler(async (req, res, next) => {
	const {
		name,
		refPerson,
		address,
		postcode,
		city,
		country,
		email,
		password,
		terms,
	} = req.body;

	const checkExisting = await Shelter.findOne({ name, email });
	if (checkExisting) {
		throw new ErrorResponse("Shelter already registered.", 409);
	}

	const addr = `${address}, ${city}, ${country}`;

	const location = await geocodeAddress(addr);

	const pwHash = await bcrypt.hash(password, 10);

	const newShelter = await Shelter.create({
		name,
		refPerson,
		address,
		postcode,
		city,
		country,
		email,
		password: pwHash,
		location: {
			type: "Point",
			coordinates: [location.lng, location.lat],
		},
		adoptionTerms: terms,
		timestamp: Date.now(),
	});

	res.status(201).send("success");
});

//Login

export const signIn = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	const checkExisting = await Shelter.findOne({ email }).select("+password");
	if (!checkExisting) {
		throw new ErrorResponse("Not registered yet!", 404);
	}
	const match = await bcrypt.compare(password, checkExisting.password);
	if (!match) {
		throw new ErrorResponse("Password wrong!", 401);
	}

	const cookie = jwt.sign({ uid: checkExisting._id }, process.env.JWT_SECRET);
	res.cookie("authtoken", cookie, {
		sameSite: "None",
		httpOnly: true,
		maxAge: 10800000,
		secure: true,
	});
	res.status(200).send({ status: "success" });
});

//Get Shelter Data

export const shelterData = asyncHandler(async (req, res, next) => {
	const uid = req.uid;
	const shelter = await Shelter.findOne({ _id: uid });
	res.status(200).json(shelter);
});

// Logout

export const signout = asyncHandler(async (req, res, next) => {
	res.clearCookie("authtoken");
	res.status(200).send({ message: "success" });
});
