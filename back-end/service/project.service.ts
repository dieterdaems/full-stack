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

//TODO: change to only use name when creating project?
const createProject = async ({ name, id }: ProjectInput): Promise<Project> => {
    if (getProjectById(id)) throw new Error(`Project with id ${id} already exists.`);
    const newProject = new Project({ id, name, team: null });
    const project = await projectDb.createProject(newProject);
    return project;
}

export default { getAllProjects, getProjectById, createProject };