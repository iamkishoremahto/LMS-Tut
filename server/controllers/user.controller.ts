import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/users.model";
import errorHandler from "../utils/errorHandler";
import { catchAsyncError } from "../middleware/catchAsyncError";
import jwt from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
require("dotenv").config();



// Register User

interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string; // optional ?

}

export const regitrationUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {

        try {
            const { name, email, password } = req.body;

            const isEmailExist = await userModel.findOne({ email: email });

            if (isEmailExist) {
                return next(new errorHandler("Email already exists", 400));
            }

            const user: IRegistrationBody = {
                name,
                email,
                password,
            };

            const activationToken = createActivationToken(user);
            const activationCode = activationToken.activationCode;

            const data = { user: { name: user.name }, activationCode };
            const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-email.ejs"), data);

            try {
                await sendMail({
                    email: user.email,
                    subject: "Activate your accound",
                    template: "activation-email.ejs",
                    data


                });
                res.status(200).json({
                    success: 200,
                    message: `Please check your email ${user.email} to activate your acount`,
                    activationToken: activationToken.token
                })

            }
            catch (err: any) {
                return next(new errorHandler(err.message, 400));
            }








        }
        catch (error: any) {
            return next(new errorHandler(error.message, 400));
        }
    }


);

interface IActivationToken {
    token: string;
    activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const secretKey: any = process.env.ACTIVATION_SECRET_KEY;

    const token = jwt.sign(
        {
            user, activationCode
        },
        secretKey,
        {
            expiresIn: "5m"
        }
    );
    return { token, activationCode };


}


//activate user

interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}


export const activateUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try{

        const { activation_token, activation_code } = req.body as IActivationRequest;

        const newUser: { user: IUser, activationCode: string } = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET_KEY as string,
        ) as { user: IUser; activationCode: string };
       
        if (newUser.activationCode !== activation_code) {
            return next(new errorHandler("Invalid activation code", 400));
        }
        const { name, email, password } = newUser.user;
        const existUser = await userModel.findOne({ email: email });
        if (existUser) {
            return next(new errorHandler("Email already exists", 400))
        }

        const user = await userModel.create({
            name,
            email,
            password,
        });
        
        res.status(201).json({
            success: true,

        })

    }
    catch(error:any){
        return next(new errorHandler(error.message,400))
    }

    }
)

