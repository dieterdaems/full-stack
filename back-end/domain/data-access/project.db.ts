import { Project } from "../model/project";
import prisma from "../../util/init-db";
import { ProjectInput } from "../../types";

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

const createProject = async (project: ProjectInput): Promise<Project> => {
    try {
        const newProject = await prisma.project.create({
            data : { name: project.name, team: { connect: { id: project.teamId } } },
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
            },
            // This function returns projects in random order, unlike getAllProjects
            // so I added the next line to the query for perfectionism purposes.
            orderBy: { id: 'asc' }
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
