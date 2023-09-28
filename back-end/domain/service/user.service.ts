import userDb from "../data-access/prisma/user.db";
import { User } from "../model/user";

const getAllUsers = async (): Promise<User[]> => userDb.getAllUsers();
const getUserByEmail = async (email: string): Promise<User> => {
    const user = await userDb.getUserByEmail(email);
    if(!user) throw new Error(`User with email ${email} does not exist.`);
    return user;
};

export default {getAllUsers, getUserByEmail};
