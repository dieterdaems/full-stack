import projectDb from "../data-access/prisma/project.db";
import { Project } from "../model/project";

const getAllProjects = async (): Promise<Project[]> => projectDb.getAllProjects();
const getProjectById = async (id: number): Promise<Project> => {
    const project = await projectDb.getProjectById(id);
    if(!project) throw new Error(`Project with id ${id} does not exist.`);
    return project;
};

export default {getAllProjects, getProjectById};