import { Project } from "../model/project";
import prisma from "../../util/init-db";

const getAllProjects = async (): Promise<Project[]> => {
    try {
        const projectsPrisma = await prisma.project.findMany(
            {
                include: {
                    team: true
                }
            }
        );
        return projectsPrisma.map((projectPrisma) => Project.from(projectPrisma));
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
                team: true
            }
        });
        return projectPrisma ? Project.from(projectPrisma) : null;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const getProjectByName = async (name: string): Promise<Project> => {
    try {
        const projectPrisma = await prisma.project.findUnique({
            where: { name: name },
            include: {
                team: true
            }
        });
        return projectPrisma ? Project.from(projectPrisma) : null;
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
        const newProject = await prisma.project.create({
            data,
            include: {
                team: true
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
                team: true
            }
        });
        return Project.from(projectPrisma);
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const getAllProjectsByUserId = async (userId: number): Promise<Project[]> => {
    try {
        const projectsPrisma = await prisma.project.findMany({
            where: {
                team: {
                    users: {
                        some: {
                            id: userId
                        }
                    }
                }
            },
            include: {
                team: true
            }
        });
        const projects = projectsPrisma.map((projectPrisma) => Project.from(projectPrisma));
        return projects;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

export default { getAllProjects, getProjectById, createProject, deleteById, getAllProjectsByUserId, getProjectByName };
