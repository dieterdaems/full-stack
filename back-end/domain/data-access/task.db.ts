import { Project } from "@prisma/client";
import { TaskInput } from "../../types";
import prisma from "../../util/init-db";
import { Task } from "../model/task";


const getAllTasks = async (): Promise<Task[]> => {
    try {
        const tasksPrisma = await prisma.task.findMany(
            {
                include: {
                    project: true
                }
            }
        );
        if (!tasksPrisma) throw new Error(`No tasks found.`);
        const tasks = tasksPrisma.map((taskPrisma) => Task.from(taskPrisma));
        return tasks;
    }
    catch (error) {
        throw new Error(error);
    }
}
const getTaskById = async (id: number): Promise<Task> => {
    try {
        const taskPrisma = await prisma.task.findUnique({
             where: { id: id },
             include: {
                    project: true
              }
            });
        if (!taskPrisma) throw new Error(`Task with id ${id} does not exist.`);
        const task = Task.from(taskPrisma);
        return task;
    }
    catch (error) {
        throw new Error(error);
    }
}

const createTask = async ({name, description, deadline, project}: Task): Promise<Task> => {
    try {
        const newTask = new Task({name, description, deadline, project});
        const taskPrisma = await prisma.task.create({
             data: { name, 
                     description, 
                     deadline, 
                        project: { connect: { id: project.id } }
                    },
                include: {project: true} });
        const task = Task.from(taskPrisma);
        return task;
    }
    catch (error) {
        throw new Error(error);
    }
}

// const updateTask = async ({name, id, description, deadline}: TaskInput): Promise<Task> => {
//     try {
//         const newTask = new Task({name, id, description, deadline});
//         const taskPrisma = await prisma.task.update({ where: { id: id },
//              data: { name, description, deadline },
//              include: {project: true} });
//         const task = Task.from(taskPrisma);
//         return task;
//     }
//     catch (error) {
//         throw new Error(error);
//     }
// }

const getTaskByProject = async (projectId: number): Promise<Task[]> => {
    try {
        const tasksPrisma = await prisma.task.findMany({ where: { projectId: projectId },
             include: {project: true} });
        if (!tasksPrisma) throw new Error(`No tasks found.`);
        const tasks = tasksPrisma.map((taskPrisma) => Task.from(taskPrisma));
        return tasks;
    }
    catch (error) {
        throw new Error(error);
    }
}

const deleteById = async (id: number): Promise<Task> => {
    try {
        const taskPrisma = await prisma.task.delete({ where: { id: id },
             include: {project: true} });
        if (!taskPrisma) throw new Error(`Task with id ${id} does not exist.`);
        const task = Task.from(taskPrisma);
        return task;
    }
    catch (error) {
        throw new Error(error);
    }
}

export default { getAllTasks, getTaskById, getTaskByProject, createTask, deleteById };