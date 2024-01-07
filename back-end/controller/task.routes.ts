import taskService from "../service/task.service";
import express, { NextFunction, Request, Response } from 'express';
import { TaskInput } from "../types";

const taskRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         deadline:
 *           type: string
 *           format: date-time
 *         completed:
 *           type: boolean
 *         project:
 *           $ref: "#/components/schemas/Project"
 *       required:
 *         - name
 *         - description
 *         - deadline
 *         - project
 *     TaskInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         deadline:
 *           type: string
 *           format: date-time
 *         projectId:
 *           type: integer
 */


/**
 * @swagger
 * /tasks/project/{id}:
 *   get:
 *     summary: Get a list of all tasks for a specific project.
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the project to retrieve the tasks off.
 *         schema:
 *           type: integer
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

taskRouter.get('/project/:id', async (req: Request & {auth: any}, res: Response, next: NextFunction) => {
    try {
        const role = req.auth.role;
        const currentUser = req.auth.id;
        const tasks = await taskService.getTasksByProjectId({id: parseInt(req.params.id), currentUser, role});
        res.status(200).json(tasks);
    }
    catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task.
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       200:
 *         description: Successful response with the created task.
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

taskRouter.post('/', async (req: Request & {auth: any}, res: Response, next: NextFunction) => {
    try {
        const task = <TaskInput>req.body;
        const currentUser = req.auth.id;
        const role = req.auth.role;
        const response = await taskService.createTask({task, currentUser, role});
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /tasks/completeTask/{id}:
 *   put:
 *     summary: Complete a task.
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to complete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with the completed task.
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
taskRouter.put('/completeTask/:id', async (req: Request & {auth:any}, res: Response, next: NextFunction) => {
    try {
        const currentUser = req.auth.id;
        const role = req.auth.role;
        const response = await taskService.completeTask({id: parseInt(req.params.id), currentUser, role});
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID.
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with the deleted task.
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

taskRouter.delete('/:id', async (req: Request & {auth: any}, res: Response, next: NextFunction) => {
    try {
        const currentUser = req.auth.id;
        const role = req.auth.role;
        const task = await taskService.deleteById({id: parseInt(req.params.id), currentUser, role});
        res.status(200).json(task);
    }
    catch (error) {
        next(error);
    }
});


export { taskRouter };