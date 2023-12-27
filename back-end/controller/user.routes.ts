/**
 * @swagger
 *  components:
 *   schemas:
 *    User:
 *      type: object
 *      properties:
 *          id:
 *              type: number
 *              format: int64
 *          name:
 *              type: string
 *          specialisation:
 *              type: string
 *          email:
 *              type: string
 *          password:
 *              type: string
 *    UserInput:
 *      type: object
 *      properties:
 *          name:
 *              type: string
 *          specialisation:
 *              type: string
 *          email:
 *              type: string
 *          password:
 *              type: string
 *    UserInputTeam:
 *      type: object
 *      properties:
 *          id:
 *              type: number
 *              format: int64
 *    UserInputLogin:
 *      type: object
 *      properties:
 *          email:
 *              type: string
 *          password:
 *              type: string 
 * */

import userService from "../service/user.service";
import express, { Request, Response, NextFunction } from 'express';
import { UserInput } from "../types";

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users.
 *     responses:
 *       200:
 *         description: Successful response with a list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
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

userRouter.get('/', async (req: Request & { auth: any }, res: Response, next: NextFunction) => {
    try {
        const role = req.auth.role;
        const users = await userService.getAllUsers(role);
        res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Get a user by email.
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: email of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with the project.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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

userRouter.get('/email/:email', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserByEmail(req.params.email);
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});

userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserById(parseInt(req.params.id));
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/add:
 *   post:
 *     summary: Create a new user.
 *     requestBody:
 *       description: User to add.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Successful response with the new user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
userRouter.post('/add', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = <UserInput>req.body; // cast to DTO
        const result = await userService.createUser(user);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/update:
 *   put:
 *     summary: Update a user.
 *     requestBody:
 *       description: User to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Successful response with the updated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
userRouter.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = <UserInput>req.body;
        const result = await userService.updateUser(user);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authenticate a user.
 *     requestBody:
 *       description: User to authenticate.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInputLogin'
 *     responses:
 *       200:
 *         description: Successful response with the JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
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
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = <UserInput>req.body;
        const result = await userService.authenticate(user);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of the user to delete.
 *         schema:
 *           type: number
 *           format: int64
 *     responses:
 *       200:
 *         description: Successful response with the deleted user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
userRouter.delete('/:id', async (req: Request & { auth: any }, res: Response, next: NextFunction) => {
    try {
        const role = req.auth.role;
        const result = await userService.deleteUserById({ id: parseInt(req.params.id), role });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});

export { userRouter };