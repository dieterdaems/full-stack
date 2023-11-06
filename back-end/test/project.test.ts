import { Project } from "../domain/model/project";
import { Team } from "../domain/model/team";


test('Given: valid data for project, When: project is created, Then: project is created with valid name',() => {
    const validName: string = "project1";
    const validId: number = 1;
    const project: Project = new Project({name: validName, id: validId}); 
    expect(project.name).toEqual(validName);
    expect(project.id).toEqual(validId);
}
)

test('Given: bad name for project, When: project is created, Then: project is not created and error is given',() => {
    const invalidName: string = "";
    const validId: number = 1;
    expect(() => new Project({name: invalidName, id: validId})).toThrowError("Project name is required.");
}
)
