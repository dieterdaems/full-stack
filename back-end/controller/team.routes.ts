import teamService from "../service/team.service";
import express, { Request, Response, NextFunction } from 'express';
import { TeamInput } from "../types";


const teamRouter = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *   Team:
 *    type: object
 *    properties:
 *      id:
 *        type: number
 *        format: int64
 *      name:
 *        type: string
 *   TeamInput:
 *    type: object
 *    properties:
 *      name:
 *        type: string
 *      users:
 *       $ref: '#/components/schemas/UserInputTeam'
 *   ProjectInputTeam:
 *    type: object
 *    properties:
 *      id:
 *       type: number
 *       format: int64
 *   TeamCreateInput:
 *    type: object
 *    properties:
 *      name:
 *        type: string
*/


/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Get a list of all teams.
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: Successful response with a list of teams.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Team'
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

teamRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teams = await teamService.getAllTeams();
        res.status(200).json(teams);
    }
    catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /teams/{id}:
 *   get:
 *     summary: Get a team by ID.
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the team to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with the project.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
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

teamRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const team = await teamService.getTeamById(parseInt(req.params.id));
        res.status(200).json(team);
    }
    catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /teams/create:
 *   post:
 *     summary: Create a new team.
 *     tags: [Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamCreateInput'
 *     responses:
 *       201:
 *         description: Successful response with the created team.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
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
teamRouter.post('/create', async (req: Request & { auth: any }, res: Response, next: NextFunction) => {
    try {
        const role = req.auth.role;
        const team = <TeamInput>req.body;
        const result = await teamService.createTeam({newTeam: team, role});
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /teams/delete/{id}:
 *   delete:
 *     summary: Delete a team by ID.
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the team to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with the deleted team.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
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
teamRouter.delete('/delete/:id', async (req: Request & { auth: any }, res: Response, next: NextFunction) => {
    try {
        const role = req.auth.role;
        const result = await teamService.deleteTeam({id: parseInt(req.params.id), role});
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});

export { teamRouter };