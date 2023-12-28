import { User } from "../model/user";
import prisma from "../../util/init-db";
import { UserInput } from "../../types";

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await prisma.user.findMany();
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
                { email: email }
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
                { id: id }
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
                email,
                password,
                role: 'user',
            }
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
                email,
                password,
                role,
            }
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
            where: { id: id }
        });
        const user = User.from(userPrisma);
        return user;
    }
    catch (error) {
        console.log(error);
        throw new Error("Database error. Check logs for more details.");
    }
}


export default { getAllUsers, getUserByEmail, getUserById, createUser, updateUser, deleteUser };
