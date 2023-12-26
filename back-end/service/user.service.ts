import userDb from "../domain/data-access/user.db";
import { User } from "../domain/model/user";
import { UserInput } from '../types';

const getAllUsers = async (): Promise<User[]> => userDb.getAllUsers();


const getUserByEmail = async (email: string): Promise<User> => {
    const user = await userDb.getUserByEmail(email);
    if (!user) throw new Error(`User with email ${email} does not exist.`);
    return user;
};

const getUserById = async (id: number): Promise<User> => {
    const user = await userDb.getUserById(id);
    if (!user) throw new Error(`User with id ${id} does not exist.`);
    return user;
}

const createUser = async ({name, specialisation, email, password}: UserInput): Promise<User> => {
    const userExists = await userDb.getUserByEmail(email);
    if (userExists) throw new Error(`User with email ${email} already exists.`);
    const user = new User({name, specialisation, email, password});
    return userDb.createUser(user);
};

const updateUser = async ({id, name, specialisation, email, password}: UserInput): Promise<User> => {
    const user = await userDb.getUserById(id);
    if (!user) throw new Error(`User with id ${id} does not exist.`);
    return userDb.updateUser({id, name, specialisation, email, password});
}

export default { getAllUsers, getUserByEmail, getUserById, createUser, updateUser };