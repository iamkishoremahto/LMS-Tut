import mongoose from "mongoose";
require("dotenv").config();

const dbUrl:string = process.env.MONGO_URI || "";

const connectDB = async () => {
    try{
        await mongoose.connect(dbUrl).then(
            (data:any) =>{
                console.log(`Database connected on host : ${data.connection.host}`);
            }
        )

    }
    catch(error){
        console.error(error);
        setTimeout(connectDB,5000);

    }
}

export default connectDB;

