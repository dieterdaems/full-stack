import { Project } from "../domain/model/project";
import { Team } from "../domain/model/team";


test('Given: valid data for project, When: project is created, Then: project is created with valid name',() => {
    const validName: string = "project1";
    const validId: number = 1;
    const validTeam: Team = new Team({name: "team1", id: 1, users: []});
    const project: Project = new Project({name: validName, id: validId, team: validTeam}); 
    expect(project.name).toEqual(validName);
    expect(project.id).toEqual(validId);
    expect(project.team).toEqual(validTeam);
}
)