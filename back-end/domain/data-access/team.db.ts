import { TeamInput } from "../../types";
import prisma from "../../util/init-db";
import { Team } from "../model/team";

const getAllTeams = async (): Promise<Team[]> => {
    try {
        const teamsPrisma = await prisma.team.findMany( {
            include: {
                users: true,
            }
        });
        if (!teamsPrisma) throw new Error(`No teams found.`);
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
            include: {
                users: true,
            }
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
            { name: name},
            include: {
                users: true,
            }
        });
        return teamPrisma ? Team.from(teamPrisma) : undefined;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const createTeam = async ({name, users}: TeamInput): Promise<Team> => {
    try {
        const teamPrisma = await prisma.team.create({
            data: {
                name,
                users: {
                    connect: users?.map((user) => ({id: user.id}))
                }
            },
            include: {users: true}
        });
        const team = Team.from(teamPrisma);
        return team;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const addUserToTeam = async (teamId: number, userId: number): Promise<Team> => {
    try {
        const teamPrisma = await prisma.team.update({
            where: {id: teamId},
            data: {
                users: {
                    connect: {id: userId}
                }
            },
            include: {users: true}
        });
        const team = Team.from(teamPrisma);
        return team;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const removeUserFromTeam = async (teamId: number, userId: number): Promise<Team> => {
    try {
        const teamPrisma = await prisma.team.update({
            where: {id: teamId},
            data: {
                users: {
                    disconnect: {id: userId}
                }
            },
            include: {users: true}
        });
        const team = Team.from(teamPrisma);
        return team;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}


export default { getAllTeams, getTeamById, getTeamByName,  createTeam, addUserToTeam, removeUserFromTeam };