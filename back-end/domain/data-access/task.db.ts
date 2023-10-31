import { TaskInput } from "../../types";
import prisma from "../../util/init-db";
import { Task } from "../model/task";


const getAllTasks = async (): Promise<Task[]> => {
    try {
        const tasksPrisma = await prisma.task.findMany();
        const tasks = tasksPrisma.map((taskPrisma) => Task.from(taskPrisma));
        return tasks;
    }
    catch (error) {
        throw new Error(error);
    }
}
const getTaskById = async (id: number): Promise<Task> => {
    try {
        const taskPrisma = await prisma.task.findUnique({ where: { id: id } });
        const task = Task.from(taskPrisma);
        return task;
    }
    catch (error) {
        throw new Error(error);
    }
}

const createTask = async ({name, id, description, deadline}: TaskInput): Promise<Task> => {
    try {
        const newTask = new Task({name, id, description, deadline});
        const taskPrisma = await prisma.task.create({ data: { name, id, description, deadline } });
        const task = Task.from(taskPrisma);
        return task;
    }
    catch (error) {
        throw new Error(error);
    }
}

const updateTask = async ({name, id, description, deadline}: TaskInput): Promise<Task> => {
    try {
        const newTask = new Task({name, id, description, deadline});
        const taskPrisma = await prisma.task.update({ where: { id: id }, data: { name, id, description, deadline } });
        const task = Task.from(taskPrisma);
        return task;
    }
    catch (error) {
        throw new Error(error);
    }
}

export default { getAllTasks, getTaskById, createTask, updateTask };