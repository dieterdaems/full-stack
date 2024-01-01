import { get } from "http";
import projectDb from "../domain/data-access/project.db";
import { Project } from "../domain/model/project";
import teamDb from "../domain/data-access/team.db";
import { ProjectInput } from "../types";
import taskDb from "../domain/data-access/task.db";
import userDb from "../domain/data-access/user.db";


const getAllProjects = async (): Promise<Project[]> => {
    // console.log("meow");
    return await projectDb.getAllProjects();
}


const getProjectById = async (id: number): Promise<Project> => {
    const project = await projectDb.getProjectById(id);
    if (!project) throw new Error(`Project with id ${id} does not exist.`);
    return project;
};

const createProject = async (projectin: ProjectInput): Promise<Project> => {
    // console.log(projectin);
    const projects = await projectDb.getAllProjects();
    // console.log(projects);
    const existingProject = projects.find((project) => project.name === projectin.name);
    // console.log(existingProject);
    if (existingProject) throw new Error(`Project with id ${existingProject.id} already exists.`);
    const teams = await teamDb.getAllTeams(); //change to find team by id?
    const team = teams.find((team) => team.id === projectin.team.id);
    const newProject = new Project({name: projectin.name, team: team});
    const project = await projectDb.createProject(newProject);
    return project;
}

const deleteProject = async (id: number): Promise<Project> => {
    const project = await projectDb.getProjectById(id);
    if (!project) throw new Error(`Project with id ${id} does not exist.`);
    const tasks = await taskDb.getAllTasks();
    const tasksToDelete = tasks.filter((task) => task.project.id === id);
    tasksToDelete.forEach(async (task) => await taskDb.deleteById(task.id));
    await projectDb.deleteById(id);
    return project;
}

const getProjectsByUserId = async (userId: number): Promise<Project[]> => {
    const projects = [];
    const user = await userDb.getUserById(userId);
    await Promise.all(user.teams.map(async team =>{ 
        const project = await projectDb.getProjectByTeamId(team.id);
        projects.push(...project);
    })
    );
    return projects;
}

export default { getAllProjects, getProjectById, createProject, deleteProject, getProjectsByUserId };