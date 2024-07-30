import mongoose from "mongoose"

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
    },
    website:{
        type: String,
    },
    location:{
        type: String,
    },
    logo:{
        type: String //url
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamp:true})

export const Company = mongoose.model("Company", companySchema)