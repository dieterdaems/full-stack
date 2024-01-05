import { UnauthorizedError } from "express-jwt";
import taskDb from "../domain/data-access/task.db";
import userDb from "../domain/data-access/user.db";
import { Task } from "../domain/model/task";
import { TaskInput } from "../types";
import projectDb from "../domain/data-access/project.db";
import projectService from "./project.service";

/*
Parameters: id of logged in user, role of logged in user
Return: all tasks if role is admin
        all tasks of user if role is user
*/
const getAllTasks = async ({currentUser, role}): Promise<Task[]> => {
    if (role === 'admin') return taskDb.getAllTasks();
    else return taskDb.getTasksByUserId(currentUser);
}

/*
Parameters: id of task to be retrieved, id of logged in user, role of logged in user
Return: task
Authorization Error: if role is not admin or user is not part of the team that the task's project belongs to
Application Error: if task does not exist
*/
const getTaskById = async ({id, currentUser, role}): Promise<Task> => {
    const task = await taskDb.getTaskById(parseInt(id));
    if (!task) throw new Error(`Task with id ${id} does not exist.`);
    const user = await userDb.getUserById(currentUser);
    if (role !== 'admin' && !user.teams.map(team => team.id).includes(task?.project.team.id) ) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' });
    return task;
};

/*
Parameters: task to be created, id of logged in user
Return: created task
Authorization Error: if user is not part of the team that the task's project belongs to
Application Error: if deadline is in the past
                   if domalin validation fails
*/
const createTask = async ({task, currentUser}: {task: TaskInput, currentUser: number}): Promise<Task> => {
    const user = await userDb.getUserById(currentUser);
    const project = await projectDb.getProjectById(task.projectId);
    if (!user.teams.map(team => team.id).includes(project?.team.id)) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to create a task for this project.' });
    if (new Date(task.deadline) < new Date()) throw new Error('Deadline must be in the future.');
    const name = task.name
    const description = task.description
    const deadline = task.deadline
    const newTask = new Task({ name, description, deadline }); // Domain validation
    return taskDb.createTask({name, description, deadline, projectId: task.projectId, userId: currentUser});
}

/*
Parameters: id of task to be deleted, id of logged in user, role of logged in user
Return: deleted task
Authorization Error: if role is not admin or user is not part of the team that the task's project belongs to
Application Error: if task does not exist
*/
const deleteById = async ({id, currentUser, role}): Promise<Task> => {
    const task = await taskDb.getTaskById(id);
    if (!task) throw new Error(`Task with id ${id} does not exist.`);
    const user = await userDb.getUserById(currentUser);
    if (role !== 'admin' && !user.teams.map(team => team.id).includes(task?.project.team.id)) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to delete this task.' });
    return taskDb.deleteById(id);
}

/*
Parameters: id of project to retrieve tasks from, id of logged in user, role of logged in user
Return: all tasks of given project, if role is admin
        all tasks of given project, if role is user AND user is part of the team that the project belongs to
*/
const getTasksByProjectId = async ({id, currentUser, role}): Promise<Task[]> => {
    const project = await projectDb.getProjectById(id);
    const user = await userDb.getUserById(currentUser);
    if (role !== 'admin' && !user.teams.map(team => team.id).includes(project?.team.id)) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' });
    return taskDb.getTasksByProjectId(id);
}

/*
Parameters: id of task to be completed, id of logged in user
Return: completed task
Authorization Error: if user is not part of the team that the task's project belongs to
*/
const completeTask = async ({id, currentUser}): Promise<Task> => {
    const task = await taskDb.getTaskById(id);
    if (!task) throw new Error(`Task with id ${id} does not exist.`);
    const user = await userDb.getUserById(currentUser);
    if (!user.teams.map(team => team.id).includes(task?.project.team.id)) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to complete this task.' });
    return taskDb.completeTask(id);
}

export default { getAllTasks, getTaskById, getTasksByProjectId, createTask, deleteById, /*updateTask,*/ completeTask };
