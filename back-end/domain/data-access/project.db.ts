import { Project } from "../model/project";
import prisma from "../../util/init-db";


const projects: Project[] = [
    new Project({ name: 'Project 1', id: 1 }),
    new Project({ name: 'Project 2', id: 2}),
];

const getAllProjects = async (): Promise<Project[]> => {
    try {
        const projectsPrisma = await prisma.project.findMany(
            {
                include: {
                    tasks: true
                }
            }
        );
        if (!projectsPrisma) throw new Error(`No projects found.`);
        const projects = projectsPrisma.map((projectPrisma) => Project.from(projectPrisma));
        return projects;
    }
    catch (error) {
        throw new Error(error);
    }
    }
const getProjectById = (id: number): Project => projects.find((p) => p.id === id);
const createProject = (project: Project): Project => {
    projects.push(project);
    return project;
}

export default { getAllProjects, getProjectById, createProject };