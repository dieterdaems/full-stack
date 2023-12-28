import { UnauthorizedError } from "express-jwt";
import teamDb from "../domain/data-access/team.db";
import UserDb from "../domain/data-access/user.db";
import { Team } from "../domain/model/team";
import { Role, TeamInput } from "../types";


const getAllTeams = async (): Promise<Team[]> => teamDb.getAllTeams();

const getTeamById = async (id: number): Promise<Team> => {
    const team = await teamDb.getTeamById(id);
    if (!team) throw new Error(`Team with id ${id} does not exist.`);
    return team;
};

const createTeam = async ({name, users}: TeamInput, role: Role): Promise<Team> => {
    if (role !== 'admin') throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to create a team.' });
    //const teamExists = teamDb.getTeamByName(name);
    // if (teamExists) throw new Error(`Team with name ${name} already exists.`);
    // const team = new Team({name, users: users}); // to validate in service layer - Not a MUST
    return teamDb.createTeam({name, users});
};

const addUserToTeam = async ({teamId, userId, currentUser, role}): Promise<Team> => {
    const user = await UserDb.getUserByEmail(currentUser.toLowerCase());
    if (role !== 'admin' && user.id !== userId) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to add another user to a team.' });
    const team = await teamDb.getTeamById(teamId);
    if (!team) throw new Error(`Team with id ${teamId} does not exist.`);
    const existingUser = await UserDb.getUserById(userId);
    if (!existingUser) throw new Error(`User with id ${userId} does not exist.`);
    return teamDb.addUserToTeam(teamId, userId);
}

const removeUserFromTeam = async({teamId, userId, currentUser, role}): Promise<Team> => {
    const user = await UserDb.getUserByEmail(currentUser.toLowerCase());
    if (role !== 'admin' && user.id !== userId) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to remove another user from a team.' });
    const team = await teamDb.getTeamById(teamId);
    if (!team) throw new Error(`Team with id ${teamId} does not exist.`);
    const existingUser = await UserDb.getUserById(userId);
    if (!existingUser) throw new Error(`User with id ${userId} does not exist.`);
    return teamDb.removeUserFromTeam(teamId, userId);
}


export default { getAllTeams, getTeamById, createTeam, addUserToTeam, removeUserFromTeam};