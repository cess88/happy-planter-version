import mongoose from "mongoose"

const planteSchema = new mongoose.Schema({
    image: {
        type: String,
    },
    family: {
        type: String,
        required: [true, "Famille obligatoire"]
    },

    name: {
        type: String,
        required: [true, "Name obligatoire"]
    },
    watering: {
        type: String,
        required: [true, "Arrosage obligatoire"]
    },
    exposure: {
        type: String,
        required: [true, "Exposition obligatoire"]
    },
    repotting: {
        type: String,
        required: [true, "Rempotage obligatoire"]
    },
    planteType: {
        type: String,
        required: [true, "type obligatoire"]
    },

    planteBobos: [{ type: mongoose.Schema.Types.ObjectId, ref: "bobos" }],

    plantColor: String,

})

const plantesModels = mongoose.model("plantes", planteSchema)



export default plantesModels