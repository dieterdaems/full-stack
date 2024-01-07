import { Team } from "../../domain/model/team";


test('Given: valid data for team, When: creating a team, Then: team is created with valid name',() => {
    const validName: string = "red devils";
    const validId: number = 1;
    const team: Team = new Team({name: validName, id: validId}); 
    expect(team.name).toEqual(validName);
    expect(team.id).toEqual(validId);
}
)

test('Given: bad name for team, When: creating a team, Then: team is not created and error is given',() => {
    const invalidName: string = "";
    const validId: number = 1;
    expect(() => new Team({name: invalidName, id: validId})).toThrowError("Team name is required");
}
)
