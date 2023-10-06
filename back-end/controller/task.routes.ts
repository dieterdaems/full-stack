import e from "express";
import taskService from "../service/task.service";
import express, { Request, Response } from 'express';

const taskRouter = express.Router();
taskRouter.get('/', async (req: Request, res: Response) => {
    try {
        const tasks = await taskService.getAllTasks();
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

export { taskRouter };