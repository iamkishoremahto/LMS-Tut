import express, {Request,Response, NextFunction } from 'express';
require('dotenv').config();
export const app = express();

import cors from "cors";
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middleware/error'
import  userRouter  from './routes/user.route';

//body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

//cors

app.use(cors({
    origin: process.env.ORIGIN
}))

//routes

app.use('/api/user',userRouter)

// testing
app.get("/test", (req:Request, res:Response, next: NextFunction) => {
    res.status(200).json({sucecess:200})
})

//unknown route
app.all("*", (req:Request, res:Response, next: NextFunction) => {
    const error = new Error (`Route ${req.originalUrl} not found` as any);
    next(error);
})

app.use(errorMiddleware);