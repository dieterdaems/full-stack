import projectService from "../service/project.service";
import express, { NextFunction, Request, Response } from 'express';
import { ProjectInput } from "../types";

const projectRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         team:
 *          $ref: '#/components/schemas/Team'
 *       required:
 *         - name
 *     ProjectCreate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         teamId:
 *           type: number
 *       required:
 *          - name
 *          - teamId
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get a list of all projects.
 *     tags: [Projects]
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


projectRouter.get('/', async (req: Request & {auth: any}, res: Response, next: NextFunction) => {
    try {
        const currentUser = req.auth.id;
        const role = req.auth.role;
        const projects = await projectService.getAllProjects({role, currentUser});
        res.status(200).json(projects);
    }
    catch (error) {
        next(error);
    }
});



/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project.
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectCreate'
 *     responses:
 *       200:
 *         description: Successful response with the created project.
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


projectRouter.post('/', async (req: Request & {auth: any}, res: Response, next: NextFunction) => {
    try {
        const currentUser = req.auth.id;
        const role = req.auth.role;
        const project = <ProjectInput>req.body;
        const newProject = await projectService.createProject({projectin: project, currentUser, role});
        res.status(200).json(newProject);
    }
    catch (error) {
        next(error);
    }
}
);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project by ID.
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the project to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with the deleted project.
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
projectRouter.delete('/:id', async (req: Request & {auth: any}, res: Response, next: NextFunction) => {
    try {
        const role = req.auth.role;
        const id = parseInt(req.params.id);
        const project = await projectService.deleteProject({id, role});
        res.status(200).json(project);
    }
    catch (error) {
        next(error);
    }
});



export { projectRouter };