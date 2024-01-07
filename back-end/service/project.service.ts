import projectDb from "../domain/data-access/project.db";
import { Project } from "../domain/model/project";
import teamDb from "../domain/data-access/team.db";
import { UnauthorizedError } from "express-jwt";
import userDb from "../domain/data-access/user.db";


/*
Parameters: role of logged in user,id of user, id of logged in user
Return: all projects if role is admin
        all projects of user if role is user
*/
const getAllProjects = async ({role, currentUser}): Promise<Project[]> => {
    if (role === 'admin') return await projectDb.getAllProjects();
    else return projectDb.getAllProjectsByUserId(currentUser);
}


/*
Parameters: project to be created, id of logged in user, role of logged in user
Return: created project
Authorization Error: if user is not admin AND user is not part of the team that the project belongs to
Application Error: if team id is not provided
                   if domalin validation fails
                   if project with same name exists
                   if team does not exist
*/
const createProject = async ({projectin, currentUser, role}): Promise<Project> => {
    // Checked here because cant be checked in domain validation.
    projectin.teamId = parseInt(projectin.teamId);
    if (!projectin.teamId && projectin.teamId !== 0) throw new Error('Team id is required.');


    const LoggedIn = await userDb.getUserById(currentUser);
    if (role !== 'admin' && !LoggedIn.teams.map(team => team.id).includes(projectin.teamId)) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to create a project for this team.' });
    
    const newProject = new Project(projectin); // Domain validation

    // name is only saved in lowercase and trimmed in the database to prevent bugs.
    const newName = newProject.name.trim().toLowerCase();

    const existingProject = await projectDb.getProjectByName(newName);
    if (existingProject) throw new Error(`Project with name ${existingProject.name} already exists.`);

    const team = await teamDb.getTeamById(projectin.teamId);
    if (!team) throw new Error(`Team with id ${projectin.teamId} does not exist.`);

    return projectDb.createProject({name: newName, teamId: projectin.teamId});
}

/*
Parameters: id of logged in user, role of logged in user
Return: deleted project
Authorization Error: if role is not admin
Application Error: if project id is not provided
                   if project does not exist
*/
const deleteProject = async ({id,role}): Promise<Project> => {
    if (role !== 'admin') throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' });
    if (!id) throw new Error('Project id is required.');
    const project = await projectDb.getProjectById(id);
    if (!project) throw new Error(`Project with id ${id} does not exist.`);
    await projectDb.deleteById(id);
    return project;
}


export default { getAllProjects, createProject, deleteProject };