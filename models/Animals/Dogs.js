import mongoose from "mongoose";

const characteristicsSchema = new mongoose.Schema({
    childenFriendly: Boolean,
    largePlace: Boolean,
    catFriendly: Boolean,
    needsExperience: Boolean,
    dogFriendly: Boolean,

})

const dogSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name benötigt."],
	},
	age: {
		type: Number,
		required: [true, "Alter benötigt."],
	},
	breed: {
		type: String,
		required: [true, "Rasse benötigt."],
	},
	description: {
		type: String,
	},
	shelter: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Shelter",
	},
	characteristics: characteristicsSchema,
	images: [String],
	timestamp: Date,
	lastchanged: Date,
});

export default mongoose.model("Dogs", dogSchema)