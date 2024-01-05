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
                    },
                    user: {
                        include: {
                            teams: true
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
                },
                user: {
                    include: {
                        teams: true
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

const createTask = async ({ name, description, deadline, projectId, userId }: TaskInput): Promise<Task> => {
    try {
        const taskPrisma = await prisma.task.create({
            data: {
                name,
                description,
                deadline,
                completed: false,
                project: { connect: { id: projectId } },
                user: { connect: { id: userId } }
            },
            include: {
                project: {
                    include: {
                        team: true
                    }
                },
                user: {
                    include: {
                        teams: true
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

const updateTask = async ({ name, id, description, deadline, completed }: TaskInput): Promise<Task> => {
    try {
        const taskPrisma = await prisma.task.update({
            where: { id: id },
            data: { name, description, deadline, completed },
            include: {
                project: {
                    include: {
                        team: true
                    }
                },
                user: {
                    include: {
                        teams: true
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
                },
                user: {
                    include: {
                        teams: true
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
                }, user: {
                    include: {
                        teams: true
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
                }, user: {
                    include: {
                        teams: true
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

const getTasksByUserId = async (userId: number): Promise<Task[]> => {
    try {
        const tasksPrisma = await prisma.task.findMany({
            where: { userId: userId },
            include: {
                project: {
                    include: {
                        team: true
                    }
                }, user: {
                    include: {
                        teams: true
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

const getTasksByProjectIdAndUserId = async (projectId: number, userId: number): Promise<Task[]> => {
    try {
        const tasksPrisma = await prisma.task.findMany({
            where: { projectId: projectId, userId: userId },
            include: {
                project: {
                    include: {
                        team: true
                    }
                }, user: {
                    include: {
                        teams: true
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


export default { getAllTasks, getTaskById, getTasksByProjectId, createTask, deleteById, updateTask, completeTask, getTasksByUserId, getTasksByProjectIdAndUserId };