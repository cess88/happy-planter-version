import mongoose from "mongoose"

const boboSchema = new mongoose.Schema({
    
    problem: {
        type: String,
    },
    solution: {
        type: String,
    }
    
})

const boboModels = mongoose.model("bobos", boboSchema)



export default boboModels