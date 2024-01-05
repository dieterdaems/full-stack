//getallprojects

import { id } from "date-fns/locale";
import projectDb from "../../domain/data-access/project.db";
import { Project } from "../../domain/model/project";
import { Team } from "../../domain/model/team";
import projectService from "../../service/project.service";
import { User } from "../../domain/model/user";
import userDb from "../../domain/data-access/user.db";
import taskDb from "../../domain/data-access/task.db";

const team = new Team({name: "team1", id: 1});
const user = new User({id: 1, name: "user1", specialisation: "specialisation1", email: "email1@t.t", password: "password1", role: "user", teams: [team]});
const project1 = new Project({name: "project1", id: 1, team: team});
const project2 = new Project({name: "project2", id: 2, team: team});

let mockProjectsDbGetAllProjects: jest.Mock;
let mockProjectsDbGetAllProjectsByUserId: jest.Mock;
let mockProjectsDbcreateProject: jest.Mock;
let mockUsersDbGetUserById: jest.Mock;
let mockProjectsDbDeleteById: jest.Mock;
let mockProjectsDbGetProjectById: jest.Mock;
let mockTasksDbDeleteById: jest.Mock;
let mockTasksDbGetAllTasks: jest.Mock;

beforeAll(() => {
    mockProjectsDbGetAllProjects = jest.fn();
    mockProjectsDbGetAllProjectsByUserId = jest.fn();
    mockUsersDbGetUserById = jest.fn();
    mockProjectsDbcreateProject = jest.fn();
    mockProjectsDbDeleteById = jest.fn();
    mockProjectsDbGetProjectById = jest.fn();
    mockTasksDbDeleteById = jest.fn();
    mockTasksDbGetAllTasks = jest.fn();
});

afterAll(() => {
    jest.clearAllMocks();
});

//tests for getAllProjects

test('given valid projects, when getAllProjects is called as admin, then all projects are returned', async () => {
    projectDb.getAllProjects = mockProjectsDbGetAllProjects.mockResolvedValue([project1, project2]);
    const projects = await projectService.getAllProjects({id: 1, role: 'admin', currentUser: 1});
    expect(projects).toEqual([project1, project2]);
}
)

test('given valid projects, when getAllProjects is called as user, then all projects of user are returned', async () => {
    projectDb.getAllProjectsByUserId = mockProjectsDbGetAllProjectsByUserId.mockResolvedValue([project1]);
    const projects = await projectService.getAllProjects({id: 1, role: 'user', currentUser: 1});
    expect(projects).toEqual([project1]);
}
)

test('given valid projects, when getAllProjects is called as user with different id, then error is thrown', async () => {
    projectDb.getAllProjectsByUserId = mockProjectsDbGetAllProjectsByUserId.mockResolvedValue([project1]);
    await expect(projectService.getAllProjects({id: 2, role: 'user', currentUser: 1})).rejects.toThrowError('You are not authorized to access this resource.');
}
)

// //tests for getProjectById

// test('given valid project, when getProjectById is called as admin, then project is returned', async () => {
//     projectDb.getProjectById = jest.fn().mockResolvedValue(project1);
//     const project = await projectService.getProjectById({id: 1, role: 'admin', currentUser: 1});
//     expect(project).toEqual(project1);
// }
// )

// test('given valid project, when getProjectById is called as user, then project is returned', async () => {
//     projectDb.getProjectById = jest.fn().mockResolvedValue(project1);
//     userDb.getUserById = jest.fn().mockResolvedValue(user);
//     const project = await projectService.getProjectById({id: 1, role: 'user', currentUser: 1});
//     expect(project).toEqual(project1);
// }
// )

//tests for createProject

test('given valid project, when createProject is called, then project is returned', async () => {
    projectDb.getAllProjects = mockProjectsDbGetAllProjects.mockResolvedValue([project2]);
    projectDb.createProject = mockProjectsDbcreateProject.mockResolvedValue(project1);
    const project = await projectService.createProject({name: "project1", team: team});
    expect(project).toEqual(project1);
}
)

test('given invalid project, when createProject is called, then error is thrown', async () => {
    projectDb.getAllProjects = mockProjectsDbGetAllProjects.mockResolvedValue([project2]);
    projectDb.createProject = mockProjectsDbcreateProject.mockResolvedValue(project1);
    await expect(projectService.createProject({name: "", team: team})).rejects.toThrowError('Project name is required.');
}
)

test('given valid project with name already in database, when createProject is called, then error is thrown', async () => {
    projectDb.getAllProjects = mockProjectsDbGetAllProjects.mockResolvedValue([project1]);
    projectDb.createProject = mockProjectsDbcreateProject.mockResolvedValue(project1);
    await expect(projectService.createProject({name: "project1", team: team})).rejects.toThrowError('Project with name project1 already exists.');
}
)

//tests for deleteProject

test('given valid project, when deleteProject is called as admin, then project is returned', async () => {
    projectDb.getProjectById = mockProjectsDbGetProjectById.mockResolvedValue(project1);
    projectDb.deleteById = mockTasksDbDeleteById.mockResolvedValue(project1);
    taskDb.getAllTasks = mockTasksDbGetAllTasks.mockResolvedValue([]);
    taskDb.deleteById = mockTasksDbDeleteById.mockResolvedValue(null);
    const project = await projectService.deleteProject({id: 1, role: 'admin'});
    expect(project).toEqual(project1);
}
)

test('given valid project, when deleteProject is called as user, then error is thrown', async () => {
    projectDb.getProjectById = mockProjectsDbGetProjectById.mockResolvedValue(project1);
    projectDb.deleteById = mockProjectsDbDeleteById.mockResolvedValue(project1);
    taskDb.getAllTasks = mockTasksDbGetAllTasks.mockResolvedValue([]);
    taskDb.deleteById = mockTasksDbDeleteById.mockResolvedValue(null);
    await expect(projectService.deleteProject({id: 1, role: 'user'})).rejects.toThrowError('You are not authorized to access this resource.');
}
)

test('given invalid project, when deleteProject is called as admin, then error is thrown', async () => {
    projectDb.getProjectById = mockProjectsDbGetProjectById.mockResolvedValue(undefined);
    projectDb.deleteById = mockProjectsDbDeleteById.mockResolvedValue(project1);
    taskDb.getAllTasks = mockTasksDbGetAllTasks.mockResolvedValue([]);
    taskDb.deleteById = mockTasksDbDeleteById.mockResolvedValue(null);
    await expect(projectService.deleteProject({id: 1, role: 'admin'})).rejects.toThrowError('Project with id 1 does not exist.');
}
)