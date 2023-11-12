import Shelter from "../models/Shelter.js";
import ErrorResponse from "../utils/ErrResp.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { geocodeAddress } from "../utils/geoCode.js";
import crypto from "crypto"
import { sendEmail } from "../utils/gmailAPI.js";
import { emailHtml } from "../email/EmailValidation.js";

//Registration

export const signUp = asyncHandler(async (req, res, next) => {
	const {
		name,
		refPerson,
		address,
		postcode,
		city,
		country,
		phone,
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

	const validationToken = (mail)=>{const token = crypto.createHmac("sha256", process.env.CRYPTO_SECRET).update(mail).digest("hex")}

	const newShelter = await Shelter.create({
		name,
		refPerson,
		address,
		postcode,
		city,
		country,
		phone,
		email,
		password: pwHash,
		location: {
			type: "Point",
			coordinates: [location.lng, location.lat],
		},
		adoptionTerms: terms,
		timestamp: Date.now(),
		emailValidationToken: validationToken(email)
	});

	const emailContent = emailHtml(refPerson || name, validationToken(email))
	sendEmail(email, "Bestätigung deiner E-Mail-Adresse", emailContent);
	res.status(201).send("success");
});

export const validateMail = asyncHandler(async(req,res, next) =>{
	const {email, token} = req.params
	const findShelter = await Shelter.findOne({email})

	if(!findShelter){
		throw new ErrorResponse("Account nicht gefunden.", 404)
	}
	if(token !== findShelter.emailValidationToken){
		throw new ErrorResponse("Falscher token.", 400)
	}

	const validatedMail = await Shelter.findOneAndUpdate({email}, {mailValidated: true}, {new: true})
	res.status(201).send("E-Mail erfolgreich bestätigt.")
})

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
	
	const shelter = await Shelter.findOne({ _id: checkExisting._id });
	res.status(200).json(shelter);
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
