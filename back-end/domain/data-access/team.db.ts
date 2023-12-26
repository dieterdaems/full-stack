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
        throw new Error(error);
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
        if (!teamPrisma) throw new Error(`Team with id ${id} does not exist.`);
        const team = Team.from(teamPrisma);
        return team;
    }
    catch (error) {
        console.log("meow")
        throw new Error(error);
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
        if (!teamPrisma) throw new Error(`Team with name ${name} does not exist.`);
        const team = Team.from(teamPrisma);
        return team;
    }
    catch (error) {
        throw new Error(error);
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
        if (!teamPrisma) throw new Error(`Team with name ${name} already exists.`);
        const team = Team.from(teamPrisma);
        return team;
    }
    catch (error) {
        throw new Error(error);
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
        if (!teamPrisma) throw new Error(`Team with id ${teamId} does not exist.`);
        const team = Team.from(teamPrisma);
        return team;
    }
    catch (error) {
        throw new Error(error);
    }
}


export default { getAllTeams, getTeamById, getTeamByName,  createTeam, addUserToTeam };