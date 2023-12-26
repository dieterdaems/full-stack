import teamDb from "../domain/data-access/team.db";
import UserDb from "../domain/data-access/user.db";
import { Team } from "../domain/model/team";
import { TeamInput } from "../types";


const getAllTeams = async (): Promise<Team[]> => teamDb.getAllTeams();

const getTeamById = async (id: number): Promise<Team> => {
    const team = await teamDb.getTeamById(id);
    if (!team) throw new Error(`Team with id ${id} does not exist.`);
    return team;
};

const createTeam = async ({name, users}: TeamInput): Promise<Team> => {
    //const teamExists = teamDb.getTeamByName(name);
    // if (teamExists) throw new Error(`Team with name ${name} already exists.`);
    // const team = new Team({name, users: users}); // to validate in service layer - Not a MUST
    return teamDb.createTeam({name, users});
};

const addUserToTeam = async (teamId: number, userId: number): Promise<Team> => {
    const team = await teamDb.getTeamById(teamId);
    if (!team) throw new Error(`Team with id ${teamId} does not exist.`);
    const user = await UserDb.getUserById(userId);
    if (!user) throw new Error(`User with id ${userId} does not exist.`);
    return teamDb.addUserToTeam(teamId, userId);
}


export default { getAllTeams, getTeamById, createTeam, addUserToTeam };