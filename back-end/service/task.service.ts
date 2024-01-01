import { UnauthorizedError } from "express-jwt";
import taskDb from "../domain/data-access/task.db";
import { Task } from "../domain/model/task";
import { TaskInput } from "../types";
import projectDb from "../domain/data-access/project.db";
import userDb from "../domain/data-access/user.db";


/*
Parameters: id of logged in user, role of logged in user
Return: all tasks if role is admin
        all tasks of user if role is user
Authorization Error: if role is not admin or user (i.e. guest in the future)
*/
const getAllTasks = async ({currentUser, role}): Promise<Task[]> => {
    if (role === 'admin') return taskDb.getAllTasks();
    else if (role === 'user') return taskDb.getTasksByUserId(currentUser);
    else throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' });
}

/*
Parameters: id of task to be retrieved, id of logged in user, role of logged in user
Return: task
Authorization Error: if role is not admin or user is not owner of task
*/
const getTaskById = async ({id, currentUser, role}): Promise<Task> => {
    const task = await taskDb.getTaskById(id);
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
    console.log(task, currentUser)
    const user = await userDb.getUserById(currentUser);
    const project = await projectDb.getProjectById(task.projectId);
    if (!user.teams.map(team => team.id).includes(project?.team.id)) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to create a task for this project.' });
    if (task.deadline < new Date()) throw new Error('Deadline must be in the future.');
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
Return: tasks of project
Authorization Error: if role is not admin or user is not part of the team that the project belongs to
*/
const getTasksByProjectId = async ({id, currentUser, role}): Promise<Task[]> => {
    const project = await projectDb.getProjectByIdAndUserId(id, currentUser);
    if (!project && role !== 'admin') throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' });
    return taskDb.getTasksByProjectId(id);
}

/*
Parameters: id of task to be updated, updated info, id of logged in user, role of logged in user
Return: updated task
Authorization Error: if role is not admin or user is not owner of task
Application Error: if task does not exist
                   if deadline is in the past
                   if domain validation fails
*/
const updateTask = async ({targetTaskId, updatedInfo, currentUser, role}): Promise<Task> => {
    const task = await taskDb.getTaskById(targetTaskId);
    if (role !== 'admin' && currentUser !== task?.user.id) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to update this task.' });
    if (!task) throw new Error(`Task with id ${targetTaskId} does not exist.`);
    if (updatedInfo.deadline < new Date()) throw new Error('Deadline must be in the future.');
    const completed = updatedInfo.completed
    const name = updatedInfo.name
    const description = updatedInfo.description
    const deadline = updatedInfo.deadline
    const newTask = new Task({ name, description, deadline, completed });
    return taskDb.updateTask(newTask);
}

/*
Parameters: id of task to be completed, id of logged in user
Return: completed task
Authorization Error: if user is not owner of task
Application Error: if task does not exist
*/
const completeTask = async ({id, currentUser}): Promise<Task> => {
    const task = await taskDb.getTaskById(id);
    if (currentUser !== task?.user.id) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to complete this task.' });
    if (!task) throw new Error(`Task with id ${id} does not exist.`);
    return taskDb.completeTask(id);
}

export default { getAllTasks, getTaskById, getTasksByProjectId, createTask, deleteById, updateTask, completeTask };
