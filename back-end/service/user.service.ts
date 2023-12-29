import userDb from "../domain/data-access/user.db";
import { User } from "../domain/model/user";
import { AuthenticationResponse, UserInput } from '../types';
import bcrypt from 'bcrypt';
import { generateJwtToken } from "../util/jwt";
import { UnauthorizedError } from "express-jwt";
import teamDb from "../domain/data-access/team.db";

const getAllUsers = async ({ role }): Promise<User[]> => {
    if (role !== 'admin') throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' })
    else return userDb.getAllUsers();
};


const getUserByEmail = async ({ email, currentUser, role }): Promise<User> => {
    if (role !== 'admin' && currentUser.toLowerCase() !== email.toLowerCase()) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' });
    const user = await userDb.getUserByEmail(email.toLowerCase());
    if (!user) throw new Error(`User with email ${email} does not exist.`);
    return user;
};

const getUserById = async ({ id, currentUser, role }): Promise<User> => {
    const user = await userDb.getUserByEmail(currentUser.toLowerCase());
    if (role !== 'admin' && user.id !== id) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' });
    const existingUser = await userDb.getUserById(id);
    if (!existingUser) throw new Error(`User with id ${id} does not exist.`);
    return existingUser;
}

const deleteUserById = async ({ id, role }): Promise<User> => {
    if (role !== 'admin') throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to delete a user.' })
    const user = await userDb.getUserById(id);
    if (!user) throw new Error(`User with id ${id} does not exist.`);
    if (user.role === 'admin') throw new Error(`You cannot delete an admin user.`);
    return userDb.deleteUser(id);
}

const createUser = async ({ name, specialisation, email, password }: UserInput): Promise<User> => {
    const existingUser = await userDb.getUserByEmail(email.toLowerCase());
    if (existingUser) throw new Error(`User with email ${email} already exists.`);

    if (!password?.trim() || password.length < 7) throw new Error('Password must be at least 7 characters');
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, specialisation, email, password: hashedPassword });
    return userDb.createUser(user);
};

const updateUser = async ({ targetUserId, updatedInfo, currentUser, currentRole }): Promise<User> => {
    const user = await userDb.getUserByEmail(currentUser.toLowerCase());
    if (currentRole !== 'admin' && user.id !== targetUserId) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to update this resource.' });
    const targetUser = await userDb.getUserById(targetUserId);
    if (!targetUser) throw new Error(`User with id ${targetUserId} does not exist.`);
    if (targetUser.email !== updatedInfo.email) {
        const existingUser = await userDb.getUserByEmail(updatedInfo.email.toLowerCase());
        if (existingUser) throw new Error(`User with email ${updatedInfo.email} already exists.`);
    }
    if (!updatedInfo.password) updatedInfo.password = targetUser.password;
    if (targetUser.password !== updatedInfo.password) {
        if (!updatedInfo.password?.trim() || updatedInfo.password.length < 7) throw new Error('Password must be at least 7 characters');
        updatedInfo.password = await bcrypt.hash(updatedInfo.password, 12);
    }
    const updatedUser = new User({ id: targetUserId, ...updatedInfo });
    return userDb.updateUser({ id: targetUserId, ...updatedUser });
}


const authenticate = async ({ email, password }: UserInput): Promise<AuthenticationResponse> => {
    const user = await userDb.getUserByEmail(email.toLowerCase());
    if (!user || !password) {
        throw new Error("Email and/or password not correct.");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error("Email and/or password not correct.");
    }
    return {
        token: generateJwtToken({ email, role: user.role }),
        id: user.id,
        role: user.role,
    };
}

const addUserToTeam = async ({teamId, userId, currentUser, role}): Promise<User> => {
    const user = await userDb.getUserByEmail(currentUser.toLowerCase());
    if (role !== 'admin' && user.id !== userId) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to add another user to a team.' });
    const team = await teamDb.getTeamById(teamId);
    if (!team) throw new Error(`Team with id ${teamId} does not exist.`);
    const existingUser = await userDb.getUserById(userId);
    if (!existingUser) throw new Error(`User with id ${userId} does not exist.`);
    return userDb.addUserToTeam(teamId, userId);
}

const removeUserFromTeam = async({teamId, userId, currentUser, role}): Promise<User> => {
    const user = await userDb.getUserByEmail(currentUser.toLowerCase());
    if (role !== 'admin' && user.id !== userId) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to remove another user from a team.' });
    const team = await teamDb.getTeamById(teamId);
    if (!team) throw new Error(`Team with id ${teamId} does not exist.`);
    const existingUser = await userDb.getUserById(userId);
    if (!existingUser) throw new Error(`User with id ${userId} does not exist.`);
    return userDb.removeUserFromTeam(teamId, userId);
}


export default { getAllUsers, getUserByEmail, getUserById, createUser, updateUser, authenticate, deleteUserById, addUserToTeam, removeUserFromTeam };