import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import {connection} from "./database/connection.js"
import userRoute from "./routes/userRoutes.js"
import companyRoute from "./routes/companyRoutes.js"
import jobRoute from "./routes/jobRoutes.js"
import applicationRoute from './routes/applicationRoutes.js'

const app=express()
config({path: "./config/config.env"})  // configuring path to the protected variables 

app.use(cors({
    origin: [process.env.FRONTED_URL],    // localhost:5173 as it is default port for vite
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true,
})) // for frontend backend connection

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

connection();

// API routes here
app.use("/api/v1/user",userRoute)
app.use("/api/v1/company",companyRoute)
app.use("/api/v1/job",jobRoute)
app.use("/api/v1/application",applicationRoute)

export default app;