import { Redis } from 'ioredis';
require('dotenv').config();

const redisClient = () =>{
    if(process.env.REDIS_URI){
        console.log(`Redis Connected`)
        return process.env.REDIS_URI
    }
    throw new Error("Redis connection failed")
}

export const redis = new Redis(redisClient());