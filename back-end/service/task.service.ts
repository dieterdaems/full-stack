import projectDb from "../domain/data-access/project.db";
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

const createTask = async (task: TaskInput): Promise<Task> => {
    const newProject = await projectDb.getProjectById(task.project.id);
    const name = task.name
    const description = task.description
    const deadline = task.deadline
    const newTask = new Task({ name, description, deadline, project: newProject });
    const ttask = await taskDb.createTask(newTask);
    return ttask;
}

const deleteById = async (id: number): Promise<Task> => {
    const task = await taskDb.deleteById(id);
    if (!task) throw new Error(`Task with id ${id} does not exist.`);
    return task;
}

// const updateTask = async ({ name, id, description, deadline }: TaskInput): Promise<Task> => {
//     if (!getTaskById(id)) throw new Error(`Task with id ${id} does not exist.`);
//     const newTask = new Task({ id, name, description, deadline });
//     const task = await taskDb.updateTask(newTask);
//     return task;
// }

const getTaskByProjectId = async (projectId: number): Promise<Task[]> => {
    const tasks = await taskDb.getTaskByProject(projectId);
    return tasks;
}

export default { getAllTasks, getTaskById, getTaskByProjectId, createTask, deleteById };
