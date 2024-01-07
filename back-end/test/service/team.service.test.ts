import teamService from '../../service/team.service';
import { Team } from '../../domain/model/team';
import teamDb from '../../domain/data-access/team.db';


const team = new Team({
    id: 1,
    name: 'red devils'
});
let mockTeamsDbGetAllTeams: jest.Mock;
let mockTeamsGetTeamById: jest.Mock;
let mockTeamsGetTeamByName: jest.Mock;
let mockTeamsCreateTeam: jest.Mock;
let mockTeamsDeleteTeam: jest.Mock;


beforeAll(() => {
    mockTeamsDbGetAllTeams = jest.fn();
    mockTeamsGetTeamById = jest.fn();
    mockTeamsGetTeamByName = jest.fn();
    mockTeamsCreateTeam = jest.fn();
    mockTeamsDeleteTeam = jest.fn();

});


afterEach(() => {
    jest.clearAllMocks();
});


/*
**********************************************************************************************
**********************************************************************************************
                                getAllTeams
**********************************************************************************************
**********************************************************************************************
*/

test('when getAllTeams is called, then all teams are returned', async () => {
    teamDb.getAllTeams = mockTeamsDbGetAllTeams.mockResolvedValue([team]);
    const teams = await teamService.getAllTeams();
    expect(teams).toEqual([team]);
});

test('when getAllTeams is called and there are no teams, then an empty array is returned', async () => {
    teamDb.getAllTeams = mockTeamsDbGetAllTeams.mockResolvedValue([]);
    const teams = await teamService.getAllTeams();
    expect(teams).toEqual([]);
});


/*
**********************************************************************************************
**********************************************************************************************
                                getTeamById
**********************************************************************************************
**********************************************************************************************
*/

test('given valid team id, when getTeamById is called, then the team is returned', async () => {
    teamDb.getTeamById = mockTeamsGetTeamById.mockResolvedValue(team);
    const teamById = await teamService.getTeamById(1);
    expect(teamById).toEqual(team);
});

test('given invalid team id, when getTeamById is called, then an error is thrown', async () => {
    teamDb.getTeamById = mockTeamsGetTeamById.mockResolvedValue(null);
    await expect(teamService.getTeamById(1)).rejects.toThrow("Team with id 1 does not exist.");
});


/*
**********************************************************************************************
**********************************************************************************************
                                createTeam
**********************************************************************************************
**********************************************************************************************
*/

test('given unused team name, when createTeam is called as admin, then the team is created and returned', async () => {
    teamDb.getTeamByName = mockTeamsGetTeamByName.mockResolvedValue(null);
    teamDb.createTeam = mockTeamsCreateTeam.mockResolvedValue(team);
    const createdTeam = await teamService.createTeam({newTeam: team, role: 'admin'});
    expect(createdTeam).toEqual(team);
});

test('given used team name, when createTeam is called as admin, then an error is thrown', async () => {
    teamDb.getTeamByName = mockTeamsGetTeamByName.mockResolvedValue(team);
    await expect(teamService.createTeam({newTeam: team, role: 'admin'})).rejects.toThrow("Team with name red devils already exists.");
});

test('given (un)used team name, when createTeam is called as user, then an error is thrown', async () => {
    await expect(teamService.createTeam({newTeam: team, role: 'user'})).rejects.toThrow("You are not authorized to create a team.");
});


/*
**********************************************************************************************
**********************************************************************************************
                                deleteTeam
**********************************************************************************************
**********************************************************************************************
*/

test('given existing team id, when createTeam is called as admin, then the team is deleted and returned', async () => {
    teamDb.getTeamById = mockTeamsGetTeamById.mockResolvedValue(team);
    teamDb.deleteTeam = mockTeamsDeleteTeam.mockResolvedValue(team);
    const deletedTeam = await teamService.deleteTeam({id: team.id, role: 'admin'});
    expect(deletedTeam).toEqual(team);
    expect(mockTeamsGetTeamById).toHaveBeenCalledTimes(1);
    expect(mockTeamsDeleteTeam).toHaveBeenCalledTimes(1);
});

test('given non-existing team id, when createTeam is called as admin, then an error is thrown', async () => {
    teamDb.getTeamById = mockTeamsGetTeamById.mockResolvedValue(null);
    await expect(teamService.deleteTeam({id: 999, role: 'admin'})).rejects.toThrow("Team with id 999 does not exist.");
});

test('given (non-)existing team id, when createTeam is called as user, then an error is thrown', async () => {
    await expect(teamService.deleteTeam({id: team.id, role: 'user'})).rejects.toThrow("You are not authorized to delete a team.");
});



