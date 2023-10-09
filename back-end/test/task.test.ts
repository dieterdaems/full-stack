import { Project } from "../domain/model/project";
import { Task } from "../domain/model/task";
import { Team } from "../domain/model/team";


test('Given: valid data for task, When: task is created, Then: task is created with valid name',() => {
    var validName: string = "task1";
    var validId: number = 1;
    var validDescription: string = "description1";
    var validDeadline: Date = new Date();
    var validProject: Project = new Project({name: "project1", id: 1, team: new Team({name: "team1", id: 1, users: []})});
    var task: Task = new Task({name: validName, id: validId, description: validDescription, deadline: validDeadline, project: validProject});
    expect(task.name).toEqual(validName);
    expect(task.id).toEqual(validId);
    expect(task.description).toEqual(validDescription);
    expect(task.deadline).toEqual(validDeadline);
    expect(task.project).toEqual(validProject);
}
)