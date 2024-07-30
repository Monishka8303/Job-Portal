import mongoose from 'mongoose';

export const connection = () => {
    
    mongoose.connect(process.env.MONGO_URL,{
        dbName: "Job_Portal_With_Automation"
    }).then(() => {
        console.log("Connected to database")
    }).catch((err) => {
        console.log(`Some error occured while connecting to database: ${err}`)
    })
}