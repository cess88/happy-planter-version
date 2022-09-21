import mongoose from "mongoose"

const planteSchema = new mongoose.Schema({
    Family: {
        type: String,
        required: [true, "Famille obligatoire"]
    },
    
    Name: {
        type: String,
        required: [true, "Name obligatoire"]
    },
    Watering:  {
        type: String,
        required: [true, "Arrosage obligatoire"]
    },
    Exposure:  {
        type: String,
        required: [true, "Exposition obligatoire"]
    },
    Repotting:  {
        type: String,
        required: [true, "Rempotage obligatoire"]
    },
    
})

const plantesModels = mongoose.model("plantes", planteSchema)



export default plantesModels