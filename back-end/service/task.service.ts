import { UnauthorizedError } from "express-jwt";
import taskDb from "../domain/data-access/task.db";
import userDb from "../domain/data-access/user.db";
import { Task } from "../domain/model/task";
import { Role, TaskInput } from "../types";
import projectDb from "../domain/data-access/project.db";


/*
Parameters: task to be created, id of logged in user, role of logged in user
Return: created task
Authorization Error: if user is not admin AND user is not part of the team that the task's project belongs to
Application Error: if project does not exist
                   if deadline is in the past
                   if domalin validation fails
*/
const createTask = async ({task, currentUser, role}: {task: TaskInput, currentUser: number, role: Role}): Promise<Task> => {
    const user = await userDb.getUserById(currentUser);
    const project = await projectDb.getProjectById(task.projectId);
    if (role !== 'admin' && !user.teams.map(team => team.id).includes(project?.team.id)) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to create a task for this project.' });
        // I put the next check after the authorization check because
        // I don't want to reveal the existence of a project to a user who is not authorized to access it.
    if (!project) throw new Error(`Project with id ${task.projectId} does not exist.`);
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
Authorization Error: if role is not admin AND user is not part of the team that the task's project belongs to
Application Error: if task does not exist
*/
const deleteById = async ({id, currentUser, role}): Promise<Task> => {
    const task = await taskDb.getTaskById(id);
    const user = await userDb.getUserById(currentUser);
    if (role !== 'admin' && !user.teams.map(team => team.id).includes(task?.project.team.id)) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to delete this task.' });
    if (!task) throw new Error(`Task with id ${id} does not exist.`);
    return taskDb.deleteById(id);
}

/*
Parameters: id of project to retrieve tasks from, id of logged in user, role of logged in user
Return: all tasks of given project, if role is admin
        all tasks of given project, if role is user AND user is part of the team that the project belongs to
Authorization Error: if user is not admin AND user is not part of the team that the task's project belongs to
Application Error: if project does not exist
*/
const getTasksByProjectId = async ({id, currentUser, role}): Promise<Task[]> => {
    const project = await projectDb.getProjectById(id);
    const user = await userDb.getUserById(currentUser);
    if (role !== 'admin' && !user.teams.map(team => team.id).includes(project?.team.id)) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' });
    // I put the next check after the authorization check because
    // I don't want to reveal the existence of a project to a user who is not authorized to access it.
    if (!project) throw new Error(`Project with id ${id} does not exist.`);
    return taskDb.getTasksByProjectId(id);
}

/*
Parameters: id of task to be completed, id of logged in user
Return: completed task
Authorization Error: if user is not admin AND user is not part of the team that the task's project belongs to
Application Error: if task does not exist
*/
const completeTask = async ({id, currentUser, role}): Promise<Task> => {
    const task = await taskDb.getTaskById(id);
    const user = await userDb.getUserById(currentUser);
    if (role !== 'admin' && !user.teams.map(team => team.id).includes(task?.project.team.id)) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to complete this task.' });
    // I put the next check after the authorization check because
    // I don't want to reveal the existence of a task to a user who is not authorized to access it.
    if (!task) throw new Error(`Task with id ${id} does not exist.`);
    return taskDb.completeTask(id);
}

export default { getTasksByProjectId, createTask, deleteById, completeTask };
