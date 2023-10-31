import taskDb from "../domain/data-access/task.db";
import { Task } from "../domain/model/task";
import { TaskInput } from "../types";

const getAllTasks = async (): Promise<Task[]> => {
    const tasks = await taskDb.getAllTasks();
    return tasks;
}

const getTaskById = async (id: number): Promise<Task> => {
    const task = await taskDb.getTaskById(id);
    if (!task) throw new Error(`Task with id ${id} does not exist.`);
    return task;
};

const createTask = async ({ name, id, description, deadline }: TaskInput): Promise<Task> => {
    if (getTaskById(id)) throw new Error(`Task with id ${id} already exists.`);
    const newTask = new Task({ id, name, description, deadline });
    const task = await taskDb.createTask(newTask);
    return task;
}

const updateTask = async ({ name, id, description, deadline }: TaskInput): Promise<Task> => {
    if (!getTaskById(id)) throw new Error(`Task with id ${id} does not exist.`);
    const newTask = new Task({ id, name, description, deadline });
    const task = await taskDb.updateTask(newTask);
    return task;
}

export default { getAllTasks, getTaskById };
