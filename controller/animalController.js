import Dogs from "../models/Animals/Dogs.js";
import Cats from "../models/Animals/Cats.js";
import Shelter from "../models/Shelter.js";
import ErrorResponse from "../utils/ErrResp.js";
import asyncHandler from "../utils/asyncHandler.js";
import { geocodeAddress } from "../utils/geoCode.js";

// GET

export const allDogs = asyncHandler(async (req, res, next) => {
	const dogs = await Dogs.find();
	res.json(dogs);
});

export const allCats = asyncHandler(async (req, res, next) => {
	const cats = await Cats.find();
	res.json(cats);
});

export const filterDogs = asyncHandler(async (req, res, next) => {
	const { city, dist, chld, lgplc, catfr, exp, dogfr } = req.query;
	const query = {};
	if (city) {
		const location = await geocodeAddress(city);
		const shelters = await Shelter.find({
			location: {
				$near: {
					$geometry: {
						type: "Point",
						coordinates: [location.lng, location.lat],
					},
					$maxDistance: dist * 1000,
				},
			},
		});

		const shelterIds = shelters.map((shelter) => shelter._id);
		query.shelter = { $in: shelterIds };
	}

	if (chld === "true") {
		query["characteristics.childenFriendly"] = true;
	}
	if (lgplc === "true") {
		query["characteristics.largePlace"] = true;
	}
	if (catfr === "true") {
		query["characteristics.catFriendly"] = true;
	}
	if (exp === "true") {
		query["characteristics.needsExperience"] = true;
	}
	if (dogfr === "true") {
		query["characteristics.dogFriendly"] = true;
	}
	try {
		const dogs = await Dogs.find(query);
		console.log(query)
		res.json(dogs);
	} catch (err) {
		throw new ErrorResponse(err);
	}
});

export const filterCats = asyncHandler(async (req, res, next) => {
	const { city, dist, chld, catfr, dogfr } = req.query;
	const query = {};
	if (city) {
		const location = await geocodeAddress(city);
		const shelters = await Shelter.find({
			location: {
				$near: {
					$geometry: {
						type: "Point",
						coordinates: [location.lng, location.lat],
					},
					$maxDistance: dist * 1000,
				},
			},
		});

		const shelterIds = shelters.map((shelter) => shelter._id);
		query.shelter = { $in: shelterIds };
	}

	if (chld === "true") {
		query["characteristics.childenFriendly"] = true;
	}
	if (catfr === "true") {
		query["characteristics.catFriendly"] = true;
	}
	if (dogfr === "true") {
		query["characteristics.dogFriendly"] = true;
	}
	try {
		const cats = await Cats.find(query);
		res.json(cats);
	} catch (err) {
		throw new ErrorResponse(err);
	}
});

export const getDogById = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const dog = await Dogs.findById(id);
	if (!dog) {
		throw new ErrorResponse("Entry does not exist.", 404);
	}
	res.json(dog);
});

export const getCatById = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const cat = await Cats.findById(id);
	if (!cat) {
		throw new ErrorResponse("Entry does not exist.", 404);
	}
	res.json(cat);
});
