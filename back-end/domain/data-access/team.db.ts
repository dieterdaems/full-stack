import prisma from "../../util/init-db";
import { Team } from "../model/team";

const getAllTeams = async (): Promise<Team[]> => {
    try {
        const teamsPrisma = await prisma.team.findMany( {
        });
        const teams = teamsPrisma.map((teamPrisma) => Team.from(teamPrisma));
        return teams;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const getTeamById = async (id: number): Promise<Team> => {
    try {
        const teamPrisma = await prisma.team.findUnique({
            where :
            { id: id},
        });
        return teamPrisma ? Team.from(teamPrisma) : undefined;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const getTeamByName = async (name: string): Promise<Team> => {
    try {
        const teamPrisma = await prisma.team.findUnique({
            where :
            { name: name.trim().toLowerCase()},
        });
        return teamPrisma ? Team.from(teamPrisma) : undefined;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const createTeam = async ({name}: Team): Promise<Team> => {
    try {
        const teamPrisma = await prisma.team.create({
            data: {
                name: name.trim().toLowerCase(),
            },
        });
        const team = Team.from(teamPrisma);
        return team;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}


export default { getAllTeams, getTeamById, getTeamByName,  createTeam };