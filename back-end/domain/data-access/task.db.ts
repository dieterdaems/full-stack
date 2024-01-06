import { TaskInput } from "../../types";
import prisma from "../../util/init-db";
import { Task } from "../model/task";

const getAllTasks = async (): Promise<Task[]> => {
    try {
        const tasksPrisma = await prisma.task.findMany(
            {
                include: {
                    project: {
                        include: {
                            team: true
                        }
                    }
                }
            }
        );
        return tasksPrisma.map((taskPrisma) => Task.from(taskPrisma));
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const getTaskById = async (id: number): Promise<Task> => {
    try {
        const taskPrisma = await prisma.task.findUnique({
            where: { id },
            include: {
                project: {
                    include: {
                        team: true
                    }
                }
            }
        });
        return taskPrisma ? Task.from(taskPrisma) : null;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const createTask = async ({ name, description, deadline, projectId }: TaskInput): Promise<Task> => {
    try {
        const taskPrisma = await prisma.task.create({
            data: {
                name,
                description,
                deadline,
                completed: false,
                project: { connect: { id: projectId } }
            },
            include: {
                project: {
                    include: {
                        team: true
                    }
                }
            }
        });
        return Task.from(taskPrisma);
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}


const getTasksByProjectId = async (projectId: number): Promise<Task[]> => {
    try {
        const tasksPrisma = await prisma.task.findMany({
            where: { projectId: projectId },
            include: {
                project: {
                    include: {
                        team: true
                    }
                }
            }
        });
        return tasksPrisma.map((taskPrisma) => Task.from(taskPrisma));
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const deleteById = async (id: number): Promise<Task> => {
    try {
        const taskPrisma = await prisma.task.delete({
            where: { id: id },
            include: {
                project: {
                    include: {
                        team: true
                    }
                }
            }
        });
        return Task.from(taskPrisma);
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const completeTask = async (id: number): Promise<Task> => {
    try {
        const taskPrisma = await prisma.task.update({
            where: { id: id },
            data: { completed: true },
            include: {
                project: {
                    include: {
                        team: true
                    }
                }
            }
        });
        return Task.from(taskPrisma);
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}


export default { getAllTasks, getTaskById, getTasksByProjectId, createTask, deleteById, completeTask };