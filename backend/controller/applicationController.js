import { Application } from "../models/ApplicationSchema.js";
import { Job } from "../models/jobSchema.js";

export const applyJob=async (req,res) => {
    try{
        const userId=req.id;
        const jobId=req.params.id;
        if(!jobId){
            return res.status(400).json({
                message: "Jobs id required",
                success: false
            })
        }

        //check if user already applied
        const existingApplication = await Application.findOne({job:jobId, applicant:userId})
        if(existingApplication){
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            })
        }

        //check if job exists
        const job= Job.findById(jobId)
        if(!job){
            return res.status(404).json({
                message: "Job Not Found",
                success: false
            })
        }

        //creating a new application
        const newApplication= await Application.create({
            job:jobId,
            applicant:userId,
        })
        await Job.findByIdAndUpdate(
            jobId,
            { $push: { application: newApplication._id } },
            { new: true } // Return the updated document
        );
        return res.status(201).json({
            message: "Job applied successfully",
            success: true
        })

    }
    catch(error){console.log(error)}
}

export const getAppliedJobs = async (req,res) => {
    try{
        const userId=req.id;
        const application= await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options: {sort: {createdAt: -1}},
            populate:{
                'path':"company",
                options: {sort: {createdAt: -1}}
            }
        })
        if(!application || application.length===0){
            return res.status(404).json({
                message: "No Applications",
                success: false
            })
        }
        return res.status(200).json({
            application,
            success: true
        })

    }
    catch(error){
        console.log(error)
    }
}

export const getApplicants = async (req,res) => {   //not working
    try {
        const jobId = req.params.id;
        console.log(jobId)
        if(!jobId){
            return res.status(400).json({
                message: "Jobs id required",
                success: false
            })
        }
        const job = await Job.findById(jobId).populate({
            path:'application',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    } catch (error) {
        console.log(error);
    }
}

export const updateStatus = async (req,res) => {
    try{
        const {status} =req.body;
        const applicationId = req.params.id

        if(!status){
            return res.status(400).json({
                message: "Status is required",
                success: false
            })
        }

        //finding application by application id
        const application = await Application.findOne({_id:applicationId})
        if(!application){
            return res.status(404).json({
                message: "Application not found",
                success: false
            })
        }

        //update status
        application.status = status.toLowerCase()
        await application.save()
        return res.status(200).json({
            message: "Status updated successfully",
            success: true
        })
    }
    catch(error){
        console.log(error)
    }
}