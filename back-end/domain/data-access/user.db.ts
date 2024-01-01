import { User } from "../model/user";
import prisma from "../../util/init-db";
import { UserInput } from "../../types";

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await prisma.user.findMany(
            {
                include: {
                    teams: true
                }
            }
        );
        const users = usersPrisma.map((userPrisma) => User.from(userPrisma));
        return users;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const getUserByEmail = async (email: string): Promise<User> => {
    try {
        const userPrisma = await prisma.user.findUnique({
            where:
                { email: email.toLowerCase() },
            include: {
                teams: true
            }
        });
        return userPrisma ? User.from(userPrisma) : undefined;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const getUserById = async (id: number): Promise<User> => {
    try {
        const userPrisma = await prisma.user.findUnique({
            where:
                { id: id },
            include: {
                teams: true
            }

        });
        return userPrisma ? User.from(userPrisma) : undefined;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const createUser = async ({ name, specialisation, email, password }: User): Promise<User> => {
    try {
        const userPrisma = await prisma.user.create({
            data: {
                name,
                specialisation,
                email: email.toLowerCase(),
                password,
                role: 'user',
            },
            include: { teams: true }
        });
        const user = User.from(userPrisma);
        return user;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const updateUser = async ({ id, name, specialisation, email, password, role }: UserInput): Promise<User> => {
    try {
        const userPrisma = await prisma.user.update({
            where: { id: id },
            data: {
                name,
                specialisation,
                email: email.toLowerCase(),
                password,
                role,
            },
            include: { teams: true }
        });
        const user = User.from(userPrisma);
        return user;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const deleteUser = async (id: number): Promise<User> => {
    try {
        const userPrisma = await prisma.user.delete({
            where: { id: id },
            include: { teams: true }
        });
        const user = User.from(userPrisma);
        return user;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const addUserToTeam = async (teamId: number, userId: number): Promise<User> => {
    try {
        const userPrisma = await prisma.user.update({
            where: {id: userId},
            data: {
                teams: {
                    connect: {id: teamId}
                }
            },
            include: {teams: true}
        });
        const user = User.from(userPrisma);
        return user;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}

const removeUserFromTeam = async (teamId: number, userId: number): Promise<User> => {
    try {
        const userPrisma = await prisma.user.update({
            where: {id: userId},
            data: {
                teams: {
                    disconnect: {id: teamId}
                }
            },
            include: {teams: true}
        });
        const user = User.from(userPrisma);
        return user;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}


export default { getAllUsers, getUserByEmail, getUserById, createUser, updateUser, deleteUser, addUserToTeam, removeUserFromTeam };
