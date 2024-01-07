//getalltasks, createtask, deletebyid,gettaskbyprojectid

import projectDb from "../../domain/data-access/project.db";
import taskDb from "../../domain/data-access/task.db";
import userDb from "../../domain/data-access/user.db";
import { Project } from "../../domain/model/project";
import { Task } from "../../domain/model/task";
import { Team } from "../../domain/model/team";
import { User } from "../../domain/model/user";
import taskService from "../../service/task.service";

const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 7);
const pastDate = new Date();
pastDate.setDate(pastDate.getDate() - 7);
const team = new Team({name: "team1", id: 1});
const team2 = new Team({name: "team2", id: 2});
const project1 = new Project({name: "project1", id: 1, team: team});
const project2 = new Project({name: "project2", id: 2, team: team2});
const user = new User({id: 1, name: "user1", specialisation: "specialisation1", email: "email1@t.t", password: "password1", role: "user", teams: [team]});
const task1 = new Task({name: "task1", id: 1, description: "description1", completed: false, deadline: futureDate, project: project1});
const task2 = new Task({name: "task2", id: 2, description: "description2", completed: false, deadline: futureDate, project: project2});
const task3 = new Task({name: "task3", id: 3, description: "description3", completed: false, deadline: futureDate, project: project1});
const task4 = new Task({name: "task4", id: 4, description: "description4", completed: false, deadline: futureDate, project: project2});
const invalidTask = new Task({name: "task1", id: 1, description: "description1", completed: false, deadline: pastDate, project: project1});


let mockTasksDbGetAllTasks: jest.Mock;
let mockTasksDbCreateTask: jest.Mock;
let mockTasksDbDeleteById: jest.Mock;
let mockgetTasksByProjectId: jest.Mock;
let mockTasksDbGetTaskByProject: jest.Mock;
let mockTasksDbGetTasksByUserId: jest.Mock;
let mockTasksDbGetTaskById: jest.Mock;
let mockUserDbGetUserById: jest.Mock;
let mockProjectDbGetProjectById: jest.Mock;

beforeAll(() => {
    mockTasksDbGetAllTasks = jest.fn();
    mockTasksDbCreateTask = jest.fn();
    mockTasksDbDeleteById = jest.fn();
    mockTasksDbGetTaskByProject = jest.fn();
    mockTasksDbGetTasksByUserId = jest.fn();
    mockTasksDbGetTaskById = jest.fn();
    mockUserDbGetUserById = jest.fn();
    mockProjectDbGetProjectById = jest.fn();
    mockgetTasksByProjectId = jest.fn();
});

afterAll(() => {
    jest.clearAllMocks();
});

//tests createTask

test('given valid task, when createTask is called, then task is created', async () => {
    taskDb.createTask = mockTasksDbCreateTask.mockResolvedValue(task1);
    userDb.getUserById = mockUserDbGetUserById.mockResolvedValue(user);
    projectDb.getProjectById = mockProjectDbGetProjectById.mockResolvedValue(project1);
    const task = await taskService.createTask({task: task1, currentUser: 1, role: 'user'});
    expect(task).toEqual(task1);
}
)

test('given invalid task, when createTask is called, then task is not created and error is given', async () => {
    taskDb.createTask = mockTasksDbCreateTask.mockResolvedValue(invalidTask);
    userDb.getUserById = mockUserDbGetUserById.mockResolvedValue(user);
    projectDb.getProjectById = mockProjectDbGetProjectById.mockResolvedValue(project1);
    await expect(() => taskService.createTask({task: invalidTask, currentUser: 1, role: 'user'})).rejects.toThrow("Deadline must be in the future.");
}
)

test('given valid task, when createTask is called and user is not part of the team that the task\'s project belongs to, then task is not created and error is given', async () => {
    taskDb.createTask = mockTasksDbCreateTask.mockResolvedValue(task2);
    userDb.getUserById = mockUserDbGetUserById.mockResolvedValue(user);
    projectDb.getProjectById = mockProjectDbGetProjectById.mockResolvedValue(project2);
    await expect(() => taskService.createTask({task: task1, currentUser: 1, role: 'user'})).rejects.toThrow("You are not authorized to create a task for this project.");
}
)

//tests deleteById

test('given valid task, when deleteById is called as admin, then task is deleted', async () => {
    taskDb.getTaskById = mockTasksDbGetTaskById.mockResolvedValue(task1);
    taskDb.deleteById = mockTasksDbDeleteById.mockResolvedValue(task1);
    const task = await taskService.deleteById({id: 1, currentUser: 1, role: "admin"});
    expect(task).toEqual(task1);
}
)

test('given valid task, when deleteById is called as user and has task in a project, then task is deleted', async () => {
    taskDb.getTaskById = mockTasksDbGetTaskById.mockResolvedValue(task1);
    taskDb.deleteById = mockTasksDbDeleteById.mockResolvedValue(task1);
    userDb.getUserById = mockUserDbGetUserById.mockResolvedValue(user);
    const task = await taskService.deleteById({id: 1, currentUser: 2, role: "user"});
    expect(task).toEqual(task1);
}
)

test('given valid task, when deleteById is called as user and does not have task in a project, then error is thrown', async () => {
    taskDb.getTaskById = mockTasksDbGetTaskById.mockResolvedValue(task2);
    userDb.getUserById = mockUserDbGetUserById.mockResolvedValue(user);
    await expect(() => taskService.deleteById({id: 1, currentUser: 3, role: "user"})).rejects.toThrow("You are not authorized to delete this task.");
}
)

test('given invalid task, when deleteById is called, then error is thrown', async () => {
    taskDb.getTaskById = mockTasksDbGetTaskById.mockResolvedValue(null);
    await expect(() => taskService.deleteById({id: 1000, currentUser: 1, role: "admin"})).rejects.toThrow("Task with id 1000 does not exist.");
}
)

//tests getTasksByProjectId

test('given valid tasks, when getTaskByProjectId is called as admin, then tasks are returned', async () => {
    taskDb.getTasksByProjectId = mockTasksDbGetTaskByProject.mockResolvedValue([task1, task3]);
    const tasks = await taskService.getTasksByProjectId({id: 1, currentUser: 1, role: "admin"});
    expect(tasks).toEqual([task1, task3]);
}
)

test('given valid tasks, when getTaskByProjectId is called as user and has task in a project, then tasks are returned', async () => {
    taskDb.getTasksByProjectId = mockTasksDbGetTaskByProject.mockResolvedValue([task1, task3]);
    userDb.getUserById = mockUserDbGetUserById.mockResolvedValue(user);
    projectDb.getProjectById = mockProjectDbGetProjectById.mockResolvedValue(project1);
    const tasks = await taskService.getTasksByProjectId({id: 1, currentUser: 1, role: "user"});
    expect(tasks).toEqual([task1, task3]);
}
)

test('given valid tasks, when getTaskByProjectId is called as user and does not have task in a project, then error is thrown', async () => {
    taskDb.getTasksByProjectId = mockTasksDbGetTaskByProject.mockResolvedValue([task2, task4]);
    userDb.getUserById = mockUserDbGetUserById.mockResolvedValue(user);
    projectDb.getProjectById = mockProjectDbGetProjectById.mockResolvedValue(project2);
    await expect(() => taskService.getTasksByProjectId({id: 1, currentUser: 1, role: "user"})).rejects.toThrow("You are not authorized to access this resource.");
}
)

test('given invalid project, when getTaskByProjectId is called, then error is thrown', async () => {
    projectDb.getProjectById = mockProjectDbGetProjectById.mockResolvedValue(null);
    taskDb.getTasksByProjectId = mockTasksDbGetTaskByProject.mockResolvedValue([]);
    await expect(() => taskService.getTasksByProjectId({id: 1000, currentUser: 1, role: "admin"})).rejects.toThrow("Project with id 1000 does not exist.");
}
)

//tests completeTask

test('given valid task, when completeTask is called, then task is completed', async () => {
    taskDb.getTaskById = mockTasksDbGetTaskById.mockResolvedValue(task1);
    taskDb.completeTask = mockTasksDbDeleteById.mockResolvedValue(task1);
    const task = await taskService.completeTask({id: 1, currentUser: 1, role: 'user'});
    expect(task).toEqual(task1);
}
)

test('given invalid task, when completeTask is called, then error is thrown', async () => {
    taskDb.getTaskById = mockTasksDbGetTaskById.mockResolvedValue(null);
    await expect(() => taskService.completeTask({id: 1000, currentUser: 1, role: 'admin'})).rejects.toThrow("Task with id 1000 does not exist.");
}
)

test('given valid task, when completeTask is called and user is not part of the team that the task\'s project belongs to, then task is not completed and error is given', async () => {
    taskDb.getTaskById = mockTasksDbGetTaskById.mockResolvedValue(task2);
    userDb.getUserById = mockUserDbGetUserById.mockResolvedValue(user);
    projectDb.getProjectById = mockProjectDbGetProjectById.mockResolvedValue(project2);
    await expect(() => taskService.completeTask({id: 1, currentUser: 1, role: 'user'})).rejects.toThrow("You are not authorized to complete this task.");
}
)