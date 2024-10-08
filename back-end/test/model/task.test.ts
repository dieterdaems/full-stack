import { Project } from "../../domain/model/project";
import { Task } from "../../domain/model/task";

const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 7);
const validName: string = "task1";
var validId: number = 1;
var validDescription: string = "description1";
var validDeadline: Date = futureDate;
var validProject: Project = new Project({name: "project1", id: 1});


test('Given: valid data for task, When: creating a task, Then: task is created with valid name',() => {
    const task: Task = new Task({name: validName, id: validId, description: validDescription, deadline: validDeadline, project: validProject});
    expect(task.name).toEqual(validName);
    expect(task.id).toEqual(validId);
    expect(task.description).toEqual(validDescription);
    expect(task.deadline).toEqual(validDeadline);
    expect(task.project).toEqual(validProject);
}
)

test('Given: bad name for task, When: creating a task, Then: task is not created and error is given',() => {
    const invalidName: string = "";
    expect(() => new Task({name: invalidName, id: validId, description: validDescription, deadline: validDeadline, project: validProject})).toThrowError("Task name is required.");
}
)

test('Given: bad description for task, When: creating a task, Then: task is not created and error is given',() => {
    var invalidDescription: string = "";
    
    expect(() => new Task({name: validName, id: validId, description: invalidDescription, deadline: validDeadline, project: validProject})).toThrowError("Task description is required.");
}
)

test('Given: bad deadline for task, When: creating a task, Then: task is not created and error is given',() => {
 
    var invalidDeadline: Date = null;
  
expect(() => new Task({name: validName, id: validId, description: validDescription, deadline: invalidDeadline, project: validProject})).toThrowError("Task deadline is required.");
}
)