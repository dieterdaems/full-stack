import teamDb from "../domain/data-access/team.db";
import { Team } from "../domain/model/team";

const getAllTeams = async (): Promise<Team[]> => teamDb.getAllTeams();
const getTeamById = async (id: number): Promise<Team> => {
    const team = await teamDb.getTeamById(id);
    if (!team) throw new Error(`Team with id ${id} does not exist.`);
    return team;
};

export default { getAllTeams, getTeamById };