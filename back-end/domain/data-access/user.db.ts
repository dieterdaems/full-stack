import { User } from "../model/user";
import prisma from "../../util/init-db";
import { UserInput } from "../../types";

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await prisma.user.findMany();
        if (!usersPrisma) throw new Error(`No users found.`);
        const users = usersPrisma.map((userPrisma) => User.from(userPrisma));
        return users;
    }
    catch (error) {
        throw new Error(error);
    }
}

const getUserByEmail = async (email: string): Promise<User> => {
    try {
        const userPrisma = await prisma.user.findUnique({
            where:
            { email: email }
        });
        return User.from(userPrisma);
    }
    catch (error) {
        return undefined;
    }
}

const getUserById = async (id: number): Promise<User> => {
    try {
        const userPrisma = await prisma.user.findUnique({
            where:
            { id: id }
        });
        if (!userPrisma) throw new Error(`User with id ${id} does not exist.`);
        const user = User.from(userPrisma);
        return user;
    }
    catch (error) {
        throw new Error(error);
    }
}

const createUser = async ({name, specialisation, email, password, role}: User): Promise<User> => {
    try {
        const userPrisma = await prisma.user.create({
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
        throw new Error(error);
    }
}

const updateUser = async ({id, name, specialisation, email, password, role}: UserInput): Promise<User> => {
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
        throw new Error(error);
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
        throw new Error(error);
    }
}


export default { getAllUsers, getUserByEmail, getUserById, createUser, updateUser, deleteUser };
