//getalltasks, createtask, deletebyid,gettaskbyprojectid

import taskDb from "../domain/data-access/task.db";
import { Project } from "../domain/model/project";
import { Task } from "../domain/model/task";
import taskService from "../service/task.service";

const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 7);
const project1 = new Project({name: "project1", id: 1});
const project2 = new Project({name: "project2", id: 2});

const task1 = new Task({name: "task1", id: 1, description: "description1", deadline: futureDate, project: project1});
const task2 = new Task({name: "task2", id: 2, description: "description2", deadline: futureDate, project: project2});
const task3 = new Task({name: "task3", id: 3, description: "description3", deadline: futureDate, project: project1});
const task4 = new Task({name: "task4", id: 4, description: "description4", deadline: futureDate, project: project2});


let mockTasksDbGetAllTasks: jest.Mock;
let mockTasksDbCreateTask: jest.Mock;
let mockTasksDbDeleteById: jest.Mock;
let mockTasksDbGetTaskByProject: jest.Mock;

beforeAll(() => {
    mockTasksDbGetAllTasks = jest.fn();
    mockTasksDbCreateTask = jest.fn();
    mockTasksDbDeleteById = jest.fn();
    mockTasksDbGetTaskByProject = jest.fn();
});

afterAll(() => {
    jest.clearAllMocks();
});

test('given valid tasks, when getAllTasks is called, then tasks are returned', async () => {
    taskDb.getAllTasks = mockTasksDbGetAllTasks.mockReturnValue([task1, task2, task3, task4]);
    const tasks = await taskService.getAllTasks();
    expect(tasks).toEqual([task1, task2, task3, task4]);
}
)

test('given valid task, when createTask is called, then task is created', async () => {
    taskDb.createTask = mockTasksDbCreateTask.mockReturnValue(task1);
    const task = await taskService.createTask(task1);
    expect(task).toEqual(task1);
}
)

test('given valid task, when deleteById is called, then task is deleted', async () => {
    taskDb.deleteById = mockTasksDbDeleteById.mockReturnValue(task1);
    const task = await taskService.deleteById(1);
    expect(task).toEqual(task1);
}
)

test('given valid tasks, when getTaskByProjectId is called, then tasks are returned', async () => {
    taskDb.getTaskByProject = mockTasksDbGetTaskByProject.mockReturnValue([task1, task3]);
    const tasks = await taskService.getTaskByProjectId(1);
    expect(tasks).toEqual([task1, task3]);
}
)