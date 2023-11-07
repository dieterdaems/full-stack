import teamDb from "../domain/data-access/team.db";
import { Team } from "../domain/model/team";
import { User } from "../domain/model/user";
import { TeamInput } from "../types";
import { UserInput } from "../types";


const getAllTeams = async (): Promise<Team[]> => teamDb.getAllTeams();
const getTeamById = async (id: number): Promise<Team> => {
    const team = await teamDb.getTeamById(id);
    if (!team) throw new Error(`Team with id ${id} does not exist.`);
    return team;
};

// const createTeam = ({name, users}: TeamInput): Team => {
//     const teamExists = teamDb.getTeamByName(name);
//     if (teamExists) throw new Error(`Team with name ${name} already exists.`);
//     const UsersArray: User[] = users?.map((user) => new User({name: user.name, specialisation: user.specialisation, email: user.email, password: user.password, id: user.id}));
//     const team = new Team({name, users: UsersArray}); // to validate in service layer - Not a MUST
//     return teamDb.createTeam(team);
// };


export default { getAllTeams, getTeamById, /*createTeam*/ };