import teamService from "../domain/service/team.service";
import express, {Request, Response } from 'express';

const teamRouter = express.Router();
teamRouter.get('/', async (req: Request, res: Response) => {
    try {
        const teams = await teamService.getAllTeams();
        res.status(200).json(teams);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }});

export {teamRouter};