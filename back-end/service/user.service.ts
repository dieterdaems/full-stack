import userDb from "../domain/data-access/user.db";
import { User } from "../domain/model/user";
import { AuthenticationResponse, UserInput } from '../types';
import bcrypt from 'bcrypt';
import { generateJwtToken } from "../util/jwt";
import { UnauthorizedError } from "express-jwt";
import teamDb from "../domain/data-access/team.db";


/*
Parameters: role of the user logged in, so role saved in JWT token
Return: all users
Authorization Error: if inlogged user is not admin
*/
const getAllUsers = async ({ role }): Promise<User[]> => {
    if (role !== 'admin') throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' })
    else return userDb.getAllUsers();
};


/*
Parameters: id of user to be retrieved, id of user logged in, so id saved in JWT token, role saved in JWT token
Return: user
Authorization Error: if inlogged user is not admin nor the same as the one to be retrieved
Application Error: if user does not exist
*/
const getUserById = async ({ id, currentUser, role }): Promise<User> => {
    if (role !== 'admin' && currentUser !== id) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' });
    const existingUser = await userDb.getUserById(id);
    if (!existingUser) throw new Error(`User with id ${id} does not exist.`);
    return existingUser;
}

/*
Parameters: id of user to be deleted, role saved in JWT token
Return: deleted user
Authorization Error: if inlogged user is not admin
Application Error: if user does not exist
                   if user is admin
*/
const deleteUserById = async ({ id, role }): Promise<User> => {
    if (role !== 'admin') throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to delete a user.' })
    const user = await userDb.getUserById(id);
    if (!user) throw new Error(`User with id ${id} does not exist.`);
    if (user.role === 'admin') throw new Error(`You cannot delete an admin user.`);
    return userDb.deleteUser(id);
}

/*
Parameters: name, specialisation, email, password of user to be created
Return: created user with hashed password
Application Error: 
            if user already exists
            if password is too short
            if domain validation failed
*/
const createUser = async ({ name, specialisation, email, password }: UserInput): Promise<User> => {
    const existingUser = await userDb.getUserByEmail(email);
    if (existingUser) throw new Error(`User with email ${email} already exists.`);

    if (!password?.trim() || password.length < 7) throw new Error('Password must be at least 7 characters');
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, specialisation, email, password: hashedPassword });
    return userDb.createUser(user);
};

/*
Parameters: id of user to be updated, updated info, id of user logged in, role saved in JWT token
Return: updated user
Authorization Errorr: if inlogged user is not admin nor the same as the one to be updated
                      if inlogged user is not admin and tries to update his role
Application Error: if user does not exist
                   if the new email is already taken
                   if password is too short
                   if domain validation failed
*/
const updateUser = async ({ targetUserId, updatedInfo, currentUser, currentRole }): Promise<User> => {
    if (currentRole !== 'admin' && currentUser !== targetUserId) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to update this resource.' });

    const targetUser = await userDb.getUserById(targetUserId);
    if (!targetUser) throw new Error(`User with id ${targetUserId} does not exist.`);

    if (targetUser.email.localeCompare(updatedInfo.email)) {
        const existingUser = await userDb.getUserByEmail(updatedInfo.email);
        if (existingUser) throw new Error(`User with email ${updatedInfo.email} already exists.`);
    }

    if (updatedInfo.password && targetUser.password !== updatedInfo.password ) {
        if (!updatedInfo.password?.trim() || updatedInfo.password.length < 7) throw new Error('Password must be at least 7 characters');
        updatedInfo.password = await bcrypt.hash(updatedInfo.password, 12);
    }

    if (currentRole !== 'admin' && updatedInfo.role && targetUser.role !== updatedInfo.role) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to update your role.' });

    const updatedUser = new User({ ...targetUser, ...updatedInfo });
    return userDb.updateUser({ id: targetUserId, ...updatedUser });
}


/*
Parameters: email, password of user to be authenticated
Return: token, id and role of user
Application Error: if email does not belong to a user
                   if password is incorrect
*/
const authenticate = async ({ email, password }: UserInput): Promise<AuthenticationResponse> => {
    const user = await userDb.getUserByEmail(email);
    if (!user || !password) {
        throw new Error("Email and/or password not correct.");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error("Email and/or password not correct.");
    }
    return {
        token: generateJwtToken({ id: user.id, role: user.role }),
        id: user.id,
        role: user.role,
    };
}

/*
Parameters: id of team to be added to, id of user to be added, id of user logged in, role of user logged in
Return: updated user with the team the user was added to
Authorization Error: if inlogged user is not admin nor the same as the one to be added to a team
Application Error: if team or user does not exist
*/
const addUserToTeam = async ({teamId, userId, currentUser, role}): Promise<User> => {
    if (role !== 'admin' && currentUser !== userId) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to add another user to a team.' });

    const team = await teamDb.getTeamById(teamId);
    if (!team) throw new Error(`Team with id ${teamId} does not exist.`);

    const existingUser = await userDb.getUserById(userId);
    if (!existingUser) throw new Error(`User with id ${userId} does not exist.`);
    
    return userDb.addUserToTeam(teamId, userId);
}

/*
Parameters: id of team to be removed from, id of user to be removed, id of user logged in, role of user logged in
Return: updated user without the team the user was removed from
Authorization Error: if inlogged user is not admin nor the same as the one to be removed from a team
Application Error: if team or user does not exist
*/
const removeUserFromTeam = async({teamId, userId, currentUser, role}): Promise<User> => {
    if (role !== 'admin' && currentUser !== userId) throw new UnauthorizedError('credentials_required', { message: 'You are not authorized to remove another user from a team.' });

    const team = await teamDb.getTeamById(teamId);
    if (!team) throw new Error(`Team with id ${teamId} does not exist.`);

    const existingUser = await userDb.getUserById(userId);
    if (!existingUser) throw new Error(`User with id ${userId} does not exist.`);

    return userDb.removeUserFromTeam(teamId, userId);
}


export default { getAllUsers, getUserById, createUser, updateUser, authenticate, deleteUserById, addUserToTeam, removeUserFromTeam };