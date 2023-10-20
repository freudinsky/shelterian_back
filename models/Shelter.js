import mongoose from "mongoose";

const shelterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name benötigt."]
    },
    pocName: {
        type: String,
        required: [true, "Name Ansprechpartner benötigt."]
    },
    address: {
        type: String,
        required: [true, "Addresse benötigt."]
    },
    postcode: {
        type: String,
        required: [true, "PLZ benötigt."]
    },
    city: {
        type: String,
        required: [true, "Stadt benötigt."]
    },
    country: {
        type: String,
        required: [true, "Land benötigt."]
    },
    email: {
        type: String,
        required: [true, "E-Mail Adresse benötigt."]
    },
    password: {
        type: String,
        required: [true, "Passwort benötigt."]
    }

})

export default mongoose.model("Shelter", shelterSchema)