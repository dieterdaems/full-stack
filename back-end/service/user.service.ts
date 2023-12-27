import userDb from "../domain/data-access/user.db";
import { User } from "../domain/model/user";
import { UserInput } from '../types';
import bcrypt from 'bcrypt';
import { generateJwtToken } from "../util/jwt";
import { UnauthorizedError } from "express-jwt";

const getAllUsers = async ({ role }): Promise<User[]> => {
    if (role !== 'admin') throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' })
    else return userDb.getAllUsers();
};


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

const deleteUserById = async ({id, role}): Promise<User> => {
    if (role !== 'admin') throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to delete a user.' })
    const user = await userDb.getUserById(id);
    if (!user) throw new Error(`User with id ${id} does not exist.`);
    return userDb.deleteUser(id);
}

const createUser = async ({ name, specialisation, email, password, role }: UserInput): Promise<User> => {
    const existingUser = await userDb.getUserByEmail(email);
    if (existingUser) throw new Error(`User with email ${email} already exists.`);

    if (!password?.trim() || password.length < 7) throw new Error('Password must be at least 7 characters');
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, specialisation, email, password: hashedPassword, role });
    return userDb.createUser(user);
};

const updateUser = async ({ id, name, specialisation, email, password, role }: UserInput): Promise<User> => {
    const existingUser = await userDb.getUserById(id);
    if (!existingUser) throw new Error(`User with id ${id} does not exist.`);
    if (existingUser.password != password && password?.trim() && password.length >= 7) {
        password = await bcrypt.hash(password, 12);
    } else {
        password = existingUser.password;
    }
    return userDb.updateUser({ id, name, specialisation, email, password, role });
}

const authenticate = async ({ email, password }: UserInput): Promise<String> => {
    const user = await userDb.getUserByEmail(email);
    if (!user) {
        throw new Error("Email and/or password not correct.");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error("Email and/or password not correct.");
    }
    return generateJwtToken({ email, role: user.role });
}

export default { getAllUsers, getUserByEmail, getUserById, createUser, updateUser, authenticate, deleteUserById };