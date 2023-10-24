import userDb from "../domain/data-access/user.db";
import { User } from "../domain/model/user";
import { UserInput } from '../types';

const getAllUsers = async (): Promise<User[]> => userDb.getAllUsers();


const getUserByEmail = async (email: string): Promise<User> => {
    const user = await userDb.getUserByEmail(email);
    if (!user) throw new Error(`User with email ${email} does not exist.`);
    return user;
};

const createUser = ({name, specialisation, email, password}: UserInput): User => {
    const userExists = userDb.getUserByEmail(email);
    if (userExists) throw new Error(`User with email ${email} already exists.`);
    const user = new User({name, specialisation, email, password});
    return userDb.createUser(user);
}

export default { getAllUsers, getUserByEmail, createUser };
