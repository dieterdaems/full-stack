import taskService from "../service/task.service";
import express, { Request, Response } from 'express';
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
 *         user:
 *           $ref: "#/components/schemas/User"
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
 *     TaskInputUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         deadline:
 *           type: string
 *           format: date-time
 *         completed:
 *           type: boolean
 */




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

taskRouter.get('/', async (req: Request & {auth: any}, res: Response) => {
    try {
        const currentUser = req.auth.id;
        const role = req.auth.role;
        const tasks = await taskService.getAllTasks({currentUser, role});
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

taskRouter.get('/:id', async (req: Request & {auth: any}, res: Response) => {
    try {
        const role = req.auth.role;
        const currentUser = req.auth.id;
        const task = await taskService.getTaskById({id: parseInt(req.params.id), currentUser, role});
        res.status(200).json(task);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /tasks/project/{id}:
 *   get:
 *     summary: Get a list of all tasks for a specific project.
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

taskRouter.get('/project/:id', async (req: Request & {auth: any}, res: Response) => {
    try {
        const role = req.auth.role;
        const currentUser = req.auth.id;
        const tasks = await taskService.getTasksByProjectId({id: parseInt(req.params.id), currentUser, role});
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task.
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

taskRouter.post('/', async (req: Request & {auth: any}, res: Response) => {
    try {
        const task = <TaskInput>req.body;
        const currentUser = req.auth.id;
        const response = await taskService.createTask({task, currentUser});
        res.status(200).json(response);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInputUpdate'
 *     responses:
 *       200:
 *         description: Successful response with the updated task.
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

taskRouter.put('/:id', async (req: Request & {auth: any}, res: Response) => {
    try {
        const currentUser = req.auth.id;
        const role = req.auth.role;
        const task = <TaskInput>req.body;
        const response = await taskService.updateTask({targetTaskId: parseInt(req.params.id), updatedInfo: task, currentUser, role});
        res.status(200).json(response);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /tasks/completeTask/{id}:
 *   put:
 *     summary: Complete a task.
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
taskRouter.put('/completeTask/:id', async (req: Request & {auth:any}, res: Response) => {
    try {
        const currentUser = req.auth.id;
        const response = await taskService.completeTask({id: parseInt(req.params.id), currentUser});
        res.status(200).json(response);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID.
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

taskRouter.delete('/:id', async (req: Request & {auth: any}, res: Response) => {
    try {
        const currentUser = req.auth.id;
        const role = req.auth.role;
        const task = await taskService.deleteById({id: parseInt(req.params.id), currentUser, role});
        res.status(200).json(task);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

export { taskRouter };