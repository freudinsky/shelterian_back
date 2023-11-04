import mongoose from "mongoose";

const shelterSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name benötigt."],
	},
	refPerson: {
		//Person of contact
		type: String,
		required: [true, "Name Ansprechpartner benötigt."],
	},
	address: {
		type: String,
		required: [true, "Addresse benötigt."],
	},
	postcode: {
		type: String,
		required: [true, "PLZ benötigt."],
	},
	location: {
		type: {
			type: String,
			enum: ["Point"],
			required: true,
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	},
	city: {
		type: String,
		required: [true, "Stadt benötigt."],
	},
	country: {
		type: String,
		required: [true, "Land benötigt."],
	},
	email: {
		type: String,
		required: [true, "E-Mail Adresse benötigt."],
        unique: true
	},
	password: {
		type: String,
		required: [true, "Passwort benötigt."],
        select: false,
	},
});

export default mongoose.model("Shelter", shelterSchema);
