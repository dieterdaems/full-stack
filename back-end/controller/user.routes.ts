import userService from "../service/user.service";
import express, { Request, Response } from 'express';

const userRouter = express.Router();
userRouter.get('/', async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});


export { userRouter };