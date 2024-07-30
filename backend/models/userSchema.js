import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        bio: {type: String},
        skills:[{type: String}],
        resume:{type:String},
        resumeOriginalName: {type:String},
        company: {type:mongoose.Schema.Types.ObjectId, ref:'Company'},  // relation between user and company 
        profilePhoto:{
            type: String, 
            default: ""
        }

    },
    role: {
        type: String,
        required: true,
        enum: ["Job Seeker","Employer"]
    }
},{timestamps:true});

export const User = mongoose.model("User", userSchema)