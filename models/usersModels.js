import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Nom obligatoire"]
    },

    mail: {
        type: String,
        required: [true, "Mail obligatoire"]
    },
    password: {
        type: String,
        required: [true, "Password obligatoire"]
    },
    role: {
        type: String,
        default: "user"
    },
    collections: [
        {
            plant: { type: mongoose.Schema.Types.ObjectId, ref: "plantes" },
            date: { type: String }
          }

    ]

})

const usersModels = mongoose.model("users", userSchema)



export default usersModels