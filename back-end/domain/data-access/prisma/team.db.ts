import { Team } from "../../model/team";

const teams: Team[] = [
    new Team({name: 'Team 1', id: 1, users: null}),
    new Team({name: 'Team 2', id: 2, users: null
}),
];

const getAllTeams = (): Team[] => teams;
const getTeamById = (id: number) : Team => teams.find((p) => p.id === id);

export default { getAllTeams, getTeamById};