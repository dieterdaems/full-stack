import { Project } from "../model/project";
import prisma from "../../util/init-db";


const getAllProjects = async (): Promise<Project[]> => {
    try {
        const projectsPrisma = await prisma.project.findMany(
            {
                include: {
                    tasks: true,
                    team: {
                        include: {
                            users: true
                        }
                    }
                }
            }
        );
        if (!projectsPrisma) throw new Error(`No projects found.`);
        // console.log(projectsPrisma);
        const projects = projectsPrisma.map((projectPrisma) => Project.from(projectPrisma));
        // console.log(projects);
        return projects;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
    }
const getProjectById = async (id: number): Promise<Project> => {
    try {
        const projectPrisma = await prisma.project.findUnique({
            where: { id: id },
            include: {
                team: {
                    include: {
                        users: true
                    }
                },
                tasks: true
            }
        });
        if (!projectPrisma) throw new Error(`Project with id ${id} does not exist.`);
        const project = Project.from(projectPrisma);
        return project;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const createProject = async (project: Project): Promise<Project> => {
    try {
        const data: any = {
            name: project.name,
        };

        if (project.team) {
            data.team = {
                connect: {
                    id: project.team.id
                }
            };
        }
        // console.log(data);
        const newProject = await prisma.project.create({
            data,
            include: {
                team: {
                    include: {
                        users: true
                    }
                },
                tasks: true
            }
        });
        return Project.from(newProject);
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }

}

const deleteById = async (id: number): Promise<Project> => {
    try {
        const projectPrisma = await prisma.project.delete({
            where: { id: id },
            include: {
                tasks: true,
                team: {
                    include: {
                        users: true
                    }
                }
            }
        });
        return Project.from(projectPrisma);
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}


export default { getAllProjects, getProjectById, createProject, deleteById };