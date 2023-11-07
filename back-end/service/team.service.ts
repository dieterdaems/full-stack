import teamDb from "../domain/data-access/team.db";
import { Team } from "../domain/model/team";
import { User } from "../domain/model/user";
import { TeamInput } from "../types";


const getAllTeams = async (): Promise<Team[]> => teamDb.getAllTeams();

const getTeamById = async (id: number): Promise<Team> => {
    const team = await teamDb.getTeamById(id);
    if (!team) throw new Error(`Team with id ${id} does not exist.`);
    return team;
};

const createTeam = ({name, users}: TeamInput): Promise<Team> => {
    //const teamExists = teamDb.getTeamByName(name);
    // if (teamExists) throw new Error(`Team with name ${name} already exists.`);
    // const team = new Team({name, users: users}); // to validate in service layer - Not a MUST
    return teamDb.createTeam({name, users});
};


export default { getAllTeams, getTeamById, createTeam };