import teamService from "../service/team.service";
import express, { Request, Response } from 'express';


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
 *      users:
 *       $ref: '#/components/schemas/User'
 *   TeamInput:
 *    type: object
 *    properties:
 *      name:
 *        type: string
 *      users:
 *       $ref: '#/components/schemas/UserInputTeam'
*/


/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Get a list of all teams.
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

teamRouter.get('/', async (req: Request, res: Response) => {
    try {
        const teams = await teamService.getAllTeams();
        res.status(200).json(teams);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /teams/{id}:
 *   get:
 *     summary: Get a team by ID.
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

teamRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const team = await teamService.getTeamById(parseInt(req.params.id));
        res.status(200).json(team);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Create a new team.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamInput'
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
teamRouter.post('/create', async (req: Request, res: Response) => {
    try {
        const team = await teamService.createTeam(req.body);
        res.status(201).json(team);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /teams/{id}/user/{userId}:
 *   post:
 *     summary: Add a user to a team.
 *     parameters:
 *       - in: path
 *         name: id
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
 *         description: Successful response with the updated team.
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
teamRouter.post('/:id/user/:userId', async (req: Request, res: Response) => {
    try {
        const team = await teamService.addUserToTeam(parseInt(req.params.id), parseInt(req.params.userId));
        res.status(201).json(team);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /teams/{id}/user/{userId}:
 *   delete:
 *     summary: Remove a user from a team.
 *     parameters:
 *       - in: path
 *         name: id
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
 *         description: Successful response with the updated team.
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
teamRouter.delete('/:id/user/:userId', async (req: Request, res: Response) => {
    try {
        const team = await teamService.removeUserFromTeam(parseInt(req.params.id), parseInt(req.params.userId));
        res.status(201).json(team);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
}
);

export { teamRouter };