import e from "express";
import taskService from "../service/task.service";
import express, { Request, Response } from 'express';

const taskRouter = express.Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get a list of all tasks.
 *     responses:
 *       200:
 *         description: Successful response with a list of tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request with an error message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 errorMessage:
 *                   type: string
 */

taskRouter.get('/', async (req: Request, res: Response) => {
    try {
        const tasks = await taskService.getAllTasks();
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with the project.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request with an error message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 errorMessage:
 *                   type: string
 */

taskRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const task = await taskService.getTaskById(parseInt(req.params.id));
        res.status(200).json(task);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

taskRouter.get('/project/:id', async (req: Request, res: Response) => {
    try {
        const tasks = await taskService.getTaskByProjectId(parseInt(req.params.id));
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

taskRouter.post('/', async (req: Request, res: Response) => {
    try {
        const task = await taskService.createTask(req.body);
        res.status(201).json(task);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

taskRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const task = await taskService.deleteById(parseInt(req.params.id));
        res.status(200).json(task);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

export { taskRouter };