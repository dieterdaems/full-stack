import projectService from "../service/project.service";
import express, { Request, Response } from 'express';
import { ProjectInput } from "../types";

const projectRouter = express.Router();

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get a list of all projects.
 *     responses:
 *       200:
 *         description: Successful response with a list of projects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
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


projectRouter.get('/', async (req: Request, res: Response) => {
    try {
        const projects = await projectService.getAllProjects();
        res.status(200).json(projects);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get a project by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the project to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with the project.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
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

projectRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const project = await projectService.getProjectById(parseInt(req.params.id));
        res.status(200).json(project);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

projectRouter.post('/add', async (req: Request, res: Response) => {
    try {
        const project = <ProjectInput>req.body;
        const newProject = await projectService.createProject(project);
        res.status(200).json(project);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
}
);

//post om toe te voegen
//put om aan te passen
//delete om te verwijderen



export { projectRouter };