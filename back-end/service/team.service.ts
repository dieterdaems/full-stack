import { UnauthorizedError } from "express-jwt";
import teamDb from "../domain/data-access/team.db";
import { Team } from "../domain/model/team";
import { Role, TeamInput } from "../types";

/*
Parameters: none
Return: all teams
*/
const getAllTeams = async (): Promise<Team[]> => teamDb.getAllTeams();

/*
Parameters: id of team to be retrieved
Return: team
Application Error: if team does not exist
*/
const getTeamById = async (id: number): Promise<Team> => {
    const team = await teamDb.getTeamById(id);
    if (!team) throw new Error(`Team with id ${id} does not exist.`);
    return team;
};

/*
Parameters: team to be created, role of user logged in
Return: created team
Authorization Error: if inlogged user is not admin
Application Error: if team with same name already exists
                   if domain validation failed
*/
const createTeam = async ({newTeam, role}: {newTeam: TeamInput, role:Role}): Promise<Team> => {
    if (role !== 'admin') throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to create a team.' });
    const newName = newTeam.name.trim().toLowerCase();
    const teamExists = await teamDb.getTeamByName(newName);
    if (teamExists) throw new Error(`Team with name ${newTeam.name} already exists.`);
    const team = new Team({...newTeam, name: newName}); // We are aware that team only has name, but we're assuming that in the future it will have more properties
    return teamDb.createTeam(team);
};

/*
Parameters: id of team to be deleted, role of user logged in
Return: deleted team
Authorization Error: if inlogged user is not admin
Application Error: if team does not exist
*/
const deleteTeam = async ({id, role}): Promise<Team> => {
    if (role !== 'admin') throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to delete a team.' })
    const team = await teamDb.getTeamById(id);
    if (!team) throw new Error(`Team with id ${id} does not exist.`);
    return teamDb.deleteTeam(id);
}



export default { getAllTeams, getTeamById, createTeam, deleteTeam};