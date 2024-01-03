import { UnauthorizedError } from "express-jwt";
import taskDb from "../domain/data-access/task.db";
import userDb from "../domain/data-access/user.db";
import { Task } from "../domain/model/task";
import { TaskInput } from "../types";
import projectDb from "../domain/data-access/project.db";

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
Authorization Error: if role is not admin or user is not owner of task
Application Error: if task does not exist
*/
const getTaskById = async ({id, currentUser, role}): Promise<Task> => {
    const task = await taskDb.getTaskById(parseInt(id));
    if (role !== 'admin' && task?.user.id !== currentUser ) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' });
    if (!task) throw new Error(`Task with id ${id} does not exist.`);
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
Authorization Error: if role is not admin or user is not owner of task
Application Error: if task does not exist
*/
const deleteById = async ({id, currentUser, role}): Promise<Task> => {
    const task = await taskDb.getTaskById(id);
    if (role !== 'admin' && currentUser !== task?.user.id) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to delete this task.' });
    if (!task) throw new Error(`Task with id ${id} does not exist.`);
    return taskDb.deleteById(id);
}

/*
Parameters: id of project to retrieve tasks from, id of logged in user, role of logged in user
Return: all tasks of given project, if role is admin
        all tasks for logged in user of given project, if role is user
*/
const getTasksByProjectId = async ({id, currentUser, role}): Promise<Task[]> => {
    const tasks = await taskDb.getTasksByProjectId(id);
    const user = await userDb.getUserById(currentUser);
    if (role === 'admin') return tasks;
    if (role === 'user' && !user.teams.some(team => team.id === id)) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' });
    return tasks;
}

/*
Parameters: id of task to be updated, updated info, id of logged in user, role of logged in user
Return: updated task
Authorization Error: if role is not admin or user is not owner of task
Application Error: if deadline is in the past
                   if domain validation fails
*/
const updateTask = async ({targetTaskId, updatedInfo, currentUser, role}): Promise<Task> => {
    const task = await taskDb.getTaskById(targetTaskId);
    if (role !== 'admin' && currentUser !== task?.user.id) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to update this task.' });
    if (new Date(updatedInfo.deadline) < new Date()) throw new Error('Deadline must be in the future.');
    const completed = updatedInfo.completed
    const name = updatedInfo.name
    const description = updatedInfo.description
    const deadline = updatedInfo.deadline
    const newTask = new Task({ name, description, deadline, completed }); // Domain validation
    return taskDb.updateTask({id: targetTaskId, name, description, deadline, completed});
}

/*
Parameters: id of task to be completed, id of logged in user
Return: completed task
Authorization Error: if user is not owner of task
*/
const completeTask = async ({id, currentUser}): Promise<Task> => {
    const task = await taskDb.getTaskById(id);
    if (currentUser !== task?.user.id) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to complete this task.' });
    return taskDb.completeTask(id);
}

export default { getAllTasks, getTaskById, getTasksByProjectId, createTask, deleteById, updateTask, completeTask };
