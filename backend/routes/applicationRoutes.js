import express from "express"
import isAuthenticated from "../middlewares/userMiddleware.js"
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controller/applicationController.js";

const router = express.Router();

router.get('/apply/:id',isAuthenticated,applyJob);
router.get('/get',isAuthenticated,getAppliedJobs);
router.get('/:id/applicants',isAuthenticated,getApplicants); //not working
//router.get('/applicants/:id',isAuthenticated,getApplicants);
router.post('/status/:id/update',isAuthenticated,updateStatus);

export default router;      