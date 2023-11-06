//getallprojects

import projectDb from "../domain/data-access/project.db";
import { Project } from "../domain/model/project";
import projectService from "../service/project.service";


const project1 = new Project({name: "project1", id: 1});
const project2 = new Project({name: "project2", id: 2});

let mockProjectsDbGetAllProjects: jest.Mock;

beforeAll(() => {
    mockProjectsDbGetAllProjects = jest.fn();
});

afterAll(() => {
    jest.clearAllMocks();
});

test('given valid projects, when getAllProjects is called, then projects are returned', async () => {
    projectDb.getAllProjects = mockProjectsDbGetAllProjects.mockReturnValue([project1, project2]);
    const projects = await projectService.getAllProjects();
    expect(projects).toEqual([project1, project2]);
}
)