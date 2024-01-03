import { get } from "http";
import projectDb from "../domain/data-access/project.db";
import { Project } from "../domain/model/project";
import teamDb from "../domain/data-access/team.db";
import { ProjectInput } from "../types";
import taskDb from "../domain/data-access/task.db";
import userDb from "../domain/data-access/user.db";


const getAllProjects = async ({role, currentUser}): Promise<Project[]> => {
    if (role === 'admin') return await projectDb.getAllProjects();
    else return await projectDb.getAllProjectsByUserId(currentUser);
}


const getProjectById = async ({id,role,currentUser}): Promise<Project> => {
    const project = await projectDb.getProjectById(id);
    if (!project) throw new Error(`Project with id ${id} does not exist.`);
    const user = await userDb.getUserById(currentUser);
    const teamsId = user.teams.map((team) => team.id);
    if (role !== 'admin' && !teamsId.some(teamId => teamId ===  id)) throw new Error(`You are not authorized to access this resource.`);
    return project;
};

const createProject = async (projectin: ProjectInput): Promise<Project> => {
    const projects = await projectDb.getAllProjects();
    const existingProject = projects.find((project) => project.name === projectin.name);
    if (existingProject) throw new Error(`Project with id ${existingProject.id} already exists.`);
    const teams = await teamDb.getAllTeams(); //change to find team by id?
    const team = teams.find((team) => team.id === projectin.team.id);
    const newProject = new Project({name: projectin.name, team: team});
    const project = await projectDb.createProject(newProject);
    return project;
}

const deleteProject = async ({id,role}): Promise<Project> => {
    if (role !== 'admin') throw new Error(`You are not authorized to delete this project.`);
    const project = await projectDb.getProjectById(id);
    if (!project) throw new Error(`Project with id ${id} does not exist.`);
    const tasks = await taskDb.getAllTasks();
    const tasksToDelete = tasks.filter((task) => task.project.id === id);
    tasksToDelete.forEach(async (task) => await taskDb.deleteById(task.id));
    await projectDb.deleteById(id);
    return project;
}

const getAllProjectsByUserId = async ({id, role, currentUser}): Promise<Project[]> => {
    const projects = await projectDb.getAllProjectsByUserId(id);
    return projects;
}

export default { getAllProjects, getProjectById, createProject, deleteProject, getAllProjectsByUserId };