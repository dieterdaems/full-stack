import projectService from "../domain/service/project.service";
import express, {Request, Response } from 'express';

const projectRouter = express.Router();
projectRouter.get('/', async (req: Request, res: Response) => {
    try {
        const projects = await projectService.getAllProjects();
        res.status(200).json(projects);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }});

export {projectRouter};