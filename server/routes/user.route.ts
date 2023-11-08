import express from 'express';
import { regitrationUser, activateUser } from '../controllers/user.controller'

const userRouter = express.Router();

userRouter.post('/registration', regitrationUser);
userRouter.post('/activate-user',activateUser);

export default userRouter;