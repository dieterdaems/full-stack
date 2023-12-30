import projectDb from "../domain/data-access/project.db";
import taskDb from "../domain/data-access/task.db";
import userDb from "../domain/data-access/user.db";
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
    // console.log('service',task)
    const newProject = await projectDb.getProjectById(task.project.id);
    // console.log('service',newProject)
    const name = task.name
    const description = task.description
    const deadline = task.deadline
    if (deadline < new Date()) throw new Error("Task deadline must be in the future.");
    //When creating a task, completed will always be false
    const newTask = new Task({ name, description, deadline, project: newProject, completed: false });
    // console.log('service',newTask)
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

const updateTask = async (task: TaskInput): Promise<Task> => {
    const id = task.id
    if (!getTaskById(id)) throw new Error(`Task with id ${id} does not exist.`);
    const completed = task.completed
    const name = task.name
    const description = task.description
    const deadline = task.deadline
    const newproject = await projectDb.getProjectById(task.project.id);
    const newTask = new Task({ id, name, description, deadline, completed, project: newproject });
    const ttask = await taskDb.updateTask(newTask);
    return ttask;
}


const getTaskByUserId = async (userId: number): Promise<Task[]> => {
    const projects = [];
    const tasks = [];
    
    const user = await userDb.getUserById(userId);


    await Promise.all(user.teams.map(async (team) => {
        const project = await projectDb.getProjectByTeamId(team.id);
        projects.push(...project);
    }));

    // alternative way:
    // for (const team of user.teams) {
    //     const project = await projectDb.getProjectByTeamId(team.id);
    //     projects.push(...project);
    // }


    await Promise.all(projects.map(async (project) => {
        const task = await taskDb.getTaskByProject(project.id);
        tasks.push(...task);
    }));

    return tasks;
};

export default { getAllTasks, getTaskById, getTaskByProjectId, createTask, deleteById, updateTask, getTaskByUserId };
