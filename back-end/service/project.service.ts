import { get } from "http";
import projectDb from "../domain/data-access/project.db";
import { Project } from "../domain/model/project";
import teamDb from "../domain/data-access/team.db";
import { ProjectInput } from "../types";


const getAllProjects = async (): Promise<Project[]> => projectDb.getAllProjects();


const getProjectById = async (id: number): Promise<Project> => {
    const project = await projectDb.getProjectById(id);
    if (!project) throw new Error(`Project with id ${id} does not exist.`);
    return project;
};

const createProject = async ({name}: ProjectInput): Promise<Project> => {
    const projects = await projectDb.getAllProjects();
    const existingProject = projects.find((project) => project.name === name);
    if (existingProject) throw new Error(`Project with id ${existingProject.id} already exists.`);
    const newProject = new Project({name});
    const project = await projectDb.createProject(newProject);
    return project;
}

export default { getAllProjects, getProjectById, createProject };