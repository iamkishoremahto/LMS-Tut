import mongoose, {Document, Model, Schema} from  'mongoose';
import bcrypt from 'bcryptjs';
import { Url } from 'url';

const emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


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

const userSchema: Schema<IUser> = new mongoose.Schema({
    name :{
        type: String,
        required: [true,"Please enter your name."]
    },
    email :{
        type: String,
        required: [true,"Please enter your email."],
        unique: true,
        validate: {
            validator: function (value:string){
                return emailPattern.test(value)
            },
            message: "Please enter a valid email."
        },
        password :{
            type: String,
            required:[true,"Please enter your password."],
            minlength:[6,"Password must be at least 6 characters"],
            select: false,
        },
        avatar:{
            public_id: String,
            url: String,
        },
        role: {
            type: String,
            default: "user"
        },
        isVerified:{
            type: Boolean,
            default: false
        },
        courses:[{
            courseId: String,

        }],
    }
},{timestamps: true});
