import { UnauthorizedError } from "express-jwt";
import teamDb from "../domain/data-access/team.db";
import { Team } from "../domain/model/team";
import { Role, TeamInput } from "../types";


const getAllTeams = async (): Promise<Team[]> => teamDb.getAllTeams();

const getTeamById = async (id: number): Promise<Team> => {
    const team = await teamDb.getTeamById(id);
    if (!team) throw new Error(`Team with id ${id} does not exist.`);
    return team;
};

const createTeam = async ({name}: TeamInput, role: Role): Promise<Team> => {
    if (role !== 'admin') throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to create a team.' });
    //const teamExists = teamDb.getTeamByName(name);
    // if (teamExists) throw new Error(`Team with name ${name} already exists.`);
    // const team = new Team({name, users: users}); // to validate in service layer - Not a MUST
    return teamDb.createTeam({name});
};



export default { getAllTeams, getTeamById, createTeam};