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
 *              format: email
 *          password:
 *              type: string
 *          team:
 *              $ref: '#/components/schemas/Team'
 *    UserInput:
 *      type: object
 *      properties:
 *          name:
 *              type: string
 *          specialisation:
 *              type: string
 *          email:
 *              type: string
 *              format: email
 *          password:
 *              type: string
 *    UserInputLogin:
 *      type: object
 *      properties:
 *          email:
 *              type: string
 *              format: email
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
        const users = await userService.getAllUsers({role});
        res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/email/{email}:
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

userRouter.get('/email/:email', async (req: Request & { auth: any }, res: Response, next: NextFunction) => {
    try {
        const currentUser = req.auth.id;
        const role = req.auth.role;
        const user = await userService.getUserByEmail({email: req.params.email, currentUser, role});
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of the user to retrieve.
 *         schema:
 *           type: number
 *           format: int64
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
userRouter.get('/:id', async (req: Request & { auth: any }, res: Response, next: NextFunction) => {
    try {
        const currentUser = req.auth.id;
        const role = req.auth.role;
        const user = await userService.getUserById({id: parseInt(req.params.id), currentUser, role});
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
 * /users/update/{id}:
 *   put:
 *     summary: Update a user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of the user to update.
 *         schema:
 *           type: integer
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
userRouter.put('/update/:id', async (req: Request & { auth: any }, res: Response, next: NextFunction) => {
    try {
        const currentRole = req.auth.role;
        const currentUser = req.auth.id;
        const user = <UserInput>req.body;
        const result = await userService.updateUser({targetUserId: parseInt(req.params.id), updatedInfo: user, currentUser, currentRole});
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


/**
 * @swagger
 * /users/team/{teamId}/user/{userId}:
 *   post:
 *     summary: Add a user to a team.
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: ID of the team to retrieve.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       201:
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
userRouter.post('/team/:teamId/user/:userId', async (req: Request & { auth: any }, res: Response, next: NextFunction) => {
    try {
        const currentUser = req.auth.id;
        const role = req.auth.role;
        const user = await userService.addUserToTeam({teamId: parseInt(req.params.teamId), userId: parseInt(req.params.userId), currentUser, role });
        res.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/team/{teamId}/user/{userId}:
 *   delete:
 *     summary: Remove a user from a team.
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: ID of the team to retrieve.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       201:
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
userRouter.delete('/team/:teamId/user/:userId', async (req: Request & { auth: any }, res: Response, next: NextFunction) => {
    try {
        const role = req.auth.role;
        const currentUser = req.auth.id;
        const user = await userService.removeUserFromTeam({teamId: parseInt(req.params.teamId), userId: parseInt(req.params.userId), currentUser, role});
        res.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
}
);



export { userRouter };