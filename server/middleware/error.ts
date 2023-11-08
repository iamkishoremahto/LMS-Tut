import errorHandler from "../utils/errorHandler";
import { NextFunction, Request, Response } from "express"

export const errorMiddleware = (
    err: any, req: Request,
    res: Response,
    next: NextFunction) => {

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Wrong MongoDB ID

    if (err.name === 'CastError') {
        const message = `Resource not found, Invalid: ${err.path}`;
        err = new errorHandler(message, 400);
    }

    //Duplicate key error
    if (err.code === 1100) {
        const message = `Duplicate key error: ${Object.keys(err.keyValue)} entered`;
        err = new errorHandler(message, 400);

    }

    //Wrong JWT Error
    if (err.name == 'JsonWebTokenError') {
        const message = `Json web token is invalid. Please try again`;
        err = new errorHandler(message, 400);

    }

    //JWT expired error
    if (err.name === 'TokenExpiredError') {
        const message = `Json web token is expired, try again`;
        err = new errorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })

}