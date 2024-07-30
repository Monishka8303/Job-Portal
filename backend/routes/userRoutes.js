import express from "express"
import {login, register, updateProfile, logout} from "../controller/userController.js"
import isAuthenticated from "../middlewares/userMiddleware.js"

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/logout',logout);
router.post('/profile/update',isAuthenticated,updateProfile);

export default router;      