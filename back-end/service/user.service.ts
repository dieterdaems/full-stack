import userDb from "../domain/data-access/user.db";
import { User } from "../domain/model/user";
import { UserInput } from '../types';
import bcrypt from 'bcrypt';

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

const createUser = async ({ name, specialisation, email, password }: UserInput): Promise<User> => {
    const existingUser = await userDb.getUserByEmail(email);
    if (existingUser) throw new Error(`User with email ${email} already exists.`);

    if (!password?.trim() || password.length < 7) throw new Error('Password must be at least 7 characters');
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, specialisation, email, password: hashedPassword });
    return userDb.createUser(user);
};

const updateUser = async ({ id, name, specialisation, email, password }: UserInput): Promise<User> => {
    const existingUser = await userDb.getUserById(id);
    if (!existingUser) throw new Error(`User with id ${id} does not exist.`);
    if (existingUser.password != password && password?.trim() && password.length >= 7) {
        password = await bcrypt.hash(password, 12);
    } else {
        password = existingUser.password;
    }
    return userDb.updateUser({ id, name, specialisation, email, password });
}

export default { getAllUsers, getUserByEmail, getUserById, createUser, updateUser };