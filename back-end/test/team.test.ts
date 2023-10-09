import { Team } from "../domain/model/team";
import { User } from "../domain/model/user";


test('Given: valid data for team, When: team is created, Then: team is created with valid name',() => {
    const validName: string = "team1";
    const validId: number = 1;
    const validUsers: User[] = [];
    const team: Team = new Team({name: validName, id: validId, users: validUsers}); 
    expect(team.name).toEqual(validName);
    expect(team.id).toEqual(validId);
    expect(team.users).toEqual(validUsers);
}
)