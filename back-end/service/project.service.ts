import { get } from "http";
import projectDb from "../domain/data-access/project.db";
import { Project } from "../domain/model/project";
import teamDb from "../domain/data-access/team.db";
import { ProjectInput } from "../types";
import taskDb from "../domain/data-access/task.db";
import userDb from "../domain/data-access/user.db";
import { UnauthorizedError } from "express-jwt";


/*
Parameters: id of user, id of logged in user, role of logged in user
Return: all projects if role is admin
        all projects of user if role is user
Authorization Error: if id of user is not same as id of logged in user
*/

const getAllProjects = async ({id, role, currentUser}): Promise<Project[]> => {
    if (role === 'admin') return await projectDb.getAllProjects();
    if (id !== currentUser) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' });
    else return await projectDb.getAllProjectsByUserId(currentUser);
}


/*
Parameters: id of project to be found, id of logged in user, role of logged in user
Return: project 
Authorization Error: if role is not admin or user is not part of project's team
Application Error: if project does not exist
*/

// const getProjectById = async ({id,role,currentUser}): Promise<Project> => {
//     const project = await projectDb.getProjectById(id);
//     if (!project) throw new Error(`Project with id ${id} does not exist.`);
//     const user = await userDb.getUserById(currentUser);
//     const teamsId = user.teams.map((team) => team.id);
//     if (role !== 'admin' && !teamsId.some(teamId => teamId ===  id)) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' });
//     return project;
// };

/*
Parameters: project to be created
Return: created project
Application Error: if project with same id exists
                   if domalin validation fails
*/

const createProject = async (projectin: ProjectInput): Promise<Project> => {
    const projects = await projectDb.getAllProjects();
    const existingProject = projects.find((project) => project.name === projectin.name);
    if (existingProject) throw new Error(`Project with name ${existingProject.name} already exists.`);
    const teams = await teamDb.getAllTeams();
    const team = teams.find((team) => team.id === projectin.team.id);
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
    const tasks = await taskDb.getAllTasks();
    const tasksToDelete = tasks.filter((task) => task.project.id === id);
    tasksToDelete.forEach(async (task) => await taskDb.deleteById(task.id));
    await projectDb.deleteById(id);
    return project;
}

// const getAllProjectsByUserId = async ({id, role, currentUser}): Promise<Project[]> => {
//     const projects = await projectDb.getAllProjectsByUserId(id);
//     return projects;
// }

export default { getAllProjects, /*getProjectById,*/ createProject, deleteProject, /*getAllProjectsByUserId*/ };