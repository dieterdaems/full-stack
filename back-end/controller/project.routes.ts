import projectService from "../service/project.service";
import express, { NextFunction, Request, Response } from 'express';
import { ProjectInput } from "../types";
import { ne } from "@faker-js/faker";

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
 * 
 *     ProjectInputTask:
 *       type: object
 *       properties:
 *         name:
 *           type: string
*           format: int64
 *         team:
 *           $ref: '#/components/schemas/ProjectInputTeam'
 *       required:
 *          - name
 * 
 *     ProjectInput:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *       required:
 *          - id
 */

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


projectRouter.get('/', async (req: Request & {auth: any}, res: Response, next: NextFunction) => {
    try {
        const currentUser = req.auth.id;
        const role = req.auth.role;
        const projects = await projectService.getAllProjects({id: 0, role, currentUser});
        res.status(200).json(projects);
    }
    catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /projects/user/{id}:
 *   get:
 *     summary: Get a list of all projects by user ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve projects from.
 *         schema:
 *           type: integer
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
projectRouter.get('/user/:id', async (req: Request & {auth: any}, res: Response, next: NextFunction) => {
    try {
        const currentUser = req.auth.id;
        const role = req.auth.role;
        const id = parseInt(req.params.id);
        const projects = await projectService.getAllProjects({id, role, currentUser});
        res.status(200).json(projects);
    }
    catch (error) {
        next(error);
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

projectRouter.get('/:id', async (req: Request & {auth: any}, res: Response, next: NextFunction) => {
    try {
        const currentUser = req.auth.id;
        const role = req.auth.role;
        const id = parseInt(req.params.id);
        const project = await projectService.getProjectById({id, role, currentUser});
        res.status(200).json(project);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInputTask'
 *     responses:
 *       201:
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
        const newProject = await projectService.createProject(project);
        res.status(200).json(newProject);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
}
);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project by ID.
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
        const currentUser = req.auth.id;
        const role = req.auth.role;
        const id = parseInt(req.params.id);
        const project = await projectService.deleteProject({id, role});
        res.status(200).json(project);
    }
    catch (error) {
        res.status(400).json({ status: 'error', errorMessage: error.message });
    }
});

// /**
//  * @swagger
//  * /projects/user/{id}:
//  *   get:
//  *     summary: Get a list of all projects for a specific user.
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: ID of the user to retrieve the tasks off.
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Successful response with a list of Projects.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Project'
//  *       400:
//  *         description: Bad request with an error message.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                 errorMessage:
//  *                   type: string
//  */

// projectRouter.get('/user/:id', async (req: Request & {auth: any}, res: Response, next: NextFunction) => {
//     try {
//         const currentUser = req.auth.id;
//         const role = req.auth.role;
//         const projects = await projectService.getAllProjectsByUserId(parseInt(req.params.id));
//         res.status(200).json(projects);
//     }
//     catch (error) {
//         res.status(400).json({ status: 'error', errorMessage: error.message });
//     }
// });




export { projectRouter };