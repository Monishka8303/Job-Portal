import {User} from '../models/userSchema.js'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async(req,res,next) => {
    try{
        const {name, email, phone, password, role} = req.body;

        if(!name || !email || !phone || !password || !role){
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message: "User already exists, try logging in",
                success: false
            })
        }

        const hashedPassword= await bcrypt.hash(password,10)
        await User.create({
            name, 
            email, 
            phone, 
            password: hashedPassword, 
            role
        })

        return res.status(201).json({
            message: "Account created successfully",
            success: true
        })

    }
    catch(error){
        console.log(error);
    }
}

export const login = async (req,res) => {
    try{
        const {email, password, role }=req.body
        if(!email || !password || !role){
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }
        let user= await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        }
        const isPasswordMatch=await bcrypt.compare(password,user.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        }
        //check role is correct or not
        if(role!=user.role){
            return res.status(400).json({
                message: "Account does not exist with current role.",
                success: false
            })
        }

        const tokenData = {
            userId: user._id
        }

        const token=jwt.sign(tokenData, process.env.JWT_SECRET_KEY,{expiresIn:'1d'})

        user={
            _id:user._id,
            name:user.name,
            email:user.email,
            phone:user.phone,
            role:user.role,
            profile:user.profile
        }

        return res.status(200).cookie("token", token , {maxAge: 1*24*60*60*1000, httpsOnly:true, sameSite:'strict'}).json({
            message: `Welcome back, ${user.name}`,
            user,
            success:true
        })

    }
    catch (error){
        console.log(error)
    }
}


export const logout = async (req,res) => {
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged out successfully",
            success:true
        })
    }
    catch(error){
        console.log(err);
    }
}

export const updateProfile = async (req,res) => {
    try{
        const {name, email, phone, bio, skills} = req.body;
        const file = req.file;

        // cloudinary config
        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }

        const userId=req.id  // middleware authentication
        let user =await User.findById(userId);

        if(!user){
            return res.status(400).json({
                message: "User Not Found",
                success: false
            })
        }

        if(name) user.name=name
        if(email) user.email=email
        if(phone) user.phone=phone
        if(bio) user.profile.bio=bio
        if(skills) user.profile.skills=skillsArray

        //Resume after cloudinary

        await user.save()

        user={
            _id:user._id,
            name:user.name,
            email:user.email,
            phone:user.phone,
            role:user.role,
            profile:user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        })
    }
    catch(error){
        console.log(error)
    }
}