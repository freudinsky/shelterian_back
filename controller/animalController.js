import Dogs from "../models/Animals/Dogs.js";
import Cats from "../models/Animals/Cats.js";
import ErrorResponse from "../utils/ErrResp.js";
import asyncHandler from "../utils/asyncHandler.js";
import { geocodeAddress } from "../utils/geoCode.js";

// GET

export const allDogs = asyncHandler(async (req, res, next) => {
	const dogs = await Dogs.find().populate("shelter");
	res.json(dogs);
});

export const allCats = asyncHandler(async (req, res, next) => {
	const cats = await Cats.find().populate("shelter");
	res.json(cats);
});

export const filterDogs = asyncHandler(async (req, res, next) => {
    const { city, dist, chld, lgplc, catfr, exp, dogfr } = req.query;
    const query = {};
	if (city) {
		const location = await geocodeAddress(city);
		const locationPoint = {
			type: "Point",
			coordinates: [location.lng, location.lat],
		};
		query.location = {
			$near: {
				$geometry: locationPoint,
				$maxDistance: dist * 1000,
			},
		};
	}
	if (chld === "true") {
		query["charesteristics.childenFriendly"] = true;
	}
	if (lgplc === "true") {
		query["charesteristics.largePlace"] = true;
	}
	if (catfr === "true") {
		query["charesteristics.catFriendly"] = true;
	}
	if (exp === "true") {
		query["charesteristics.needsExperience"] = true;
	}
	if (dogfr === "true") {
		query["charesteristics.dogFriendly"] = true;
	}
	try {
		const dogs = await Dogs.aggregate([
			{
				$geoNear: {
					near: {
						type: "Point",
						coordinates: [location.lng, location.lat],
					},
					distanceField: "distance",
					maxDistance: dist * 1000,
					spherical: true,
				},
			},
			{
				$match: query,
			},
		]).exec();
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
		const locationPoint = {
			type: "Point",
			coordinates: [location.lng, location.lat],
		};
		query.location = {
			$near: {
				$geometry: locationPoint,
				$maxDistance: dist * 1000,
			},
		};
	}
	
	if (chld === "true") {
		query["charesteristics.childenFriendly"] = true;
	}
	if (catfr === "true") {
		query["charesteristics.catFriendly"] = true;
	}
	if (dogfr === "true") {
		query["charesteristics.dogFriendly"] = true;
	}
	try {
		const cats = await Cats.aggregate([
			{
				$geoNear: {
					near: {
						type: "Point",
						coordinates: [location.lng, location.lat],
					},
					distanceField: "distance",
					maxDistance: dist * 1000,
					spherical: true,
				},
			},
			{
				$match: query,
			},
		]).exec();
		res.json(cats);
	} catch (err) {
		throw new ErrorResponse(err);
	}
});

export const getDogById = asyncHandler(async(req,res,next) => {
    const {id} = req.params;
    const dog = await Dogs.findById(id).populate('shelter')
    if(!dog){
        throw new ErrorResponse('Entry does not exist.', 404)
    }
    res.json(dog)
})

export const getCatById = asyncHandler(async(req, res, next) => {
	const {id} = req.params;
	const cat = await Cats.findById(id).populate('shelter')
	if(!cat){
		throw new ErrorResponse('Entry does not exist.', 404)
	}
	res.json(cat)
})

