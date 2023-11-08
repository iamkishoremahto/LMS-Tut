import mongoose, {Document, Model, Schema} from  'mongoose';
import bcrypt from 'bcryptjs';
import { Url } from 'url';

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    avatar:{
        public_id:string;
        url:string;
    },
    role: string;
    isVerified: boolean;
    courses: Array<{courseId:string}>;

    comparePassword: (password: string) => Promise<boolean>;
    
};
