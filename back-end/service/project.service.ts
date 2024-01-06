import { get } from "http";
import projectDb from "../domain/data-access/project.db";
import { Project } from "../domain/model/project";
import teamDb from "../domain/data-access/team.db";
import { ProjectInput } from "../types";
import taskDb from "../domain/data-access/task.db";
import userDb from "../domain/data-access/user.db";
import { UnauthorizedError } from "express-jwt";


/*
Parameters: role of logged in user,id of user, id of logged in user
Return: all projects if role is admin
        all projects of user if role is user
*/
const getAllProjects = async ({role, currentUser}): Promise<Project[]> => {
    if (role === 'admin') return await projectDb.getAllProjects();
    else return await projectDb.getAllProjectsByUserId(currentUser);
}


/*
Parameters: project to be created
Return: created project
Application Error: if project with same name exists
                   if domalin validation fails
*/
const createProject = async (projectin: ProjectInput): Promise<Project> => {
    const existingProject = await projectDb.getProjectByName(projectin.name);
    if (existingProject) throw new Error(`Project with name ${existingProject.name} already exists.`);
    const team = await teamDb.getTeamById(projectin.teamId);
    if (!team) throw new Error(`Team with id ${projectin.teamId} does not exist.`);
    const newProject = new Project({name: projectin.name, team: team});
    const project = await projectDb.createProject(newProject);
    return project;
}

/*
Parameters: id of logged in user, role of logged in user
Return: deleted project
Authorization Error: if role is not admin
Application Error: if project does not exist
*/
const deleteProject = async ({id,role}): Promise<Project> => {
    if (role !== 'admin') throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' });
    const project = await projectDb.getProjectById(id);
    if (!project) throw new Error(`Project with id ${id} does not exist.`);
    await projectDb.deleteById(id);
    return project;
}


export default { getAllProjects, createProject, deleteProject };