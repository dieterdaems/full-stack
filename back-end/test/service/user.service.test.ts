import userService from '../../service/user.service';
import userDb from '../../domain/data-access/user.db';
import { UnauthorizedError } from 'express-jwt';
import { User } from '../../domain/model/user';
import teamDb from '../../domain/data-access/team.db';
import bcrypt from 'bcrypt';

const user = new User({
    id: 1,
    name: 'user1',
    specialisation: 'Developer',
    email: 'email1@t.t',
    password: 'password1',
    role: 'user',
});

const admin = new User({
    id: 2,
    name: 'user2',
    specialisation: 'IT Support',
    email: 'email2@t.t',
    password: 'password2',
    role: 'admin',
});

const hashedPassword = 'hashedPassword';

let mockUsersDbGetAllUsers: jest.Mock;
let mockUsersDbGetUserById: jest.Mock;
let mockUserDbGetUserByEmail: jest.Mock;
let mockUsersDbcreateUser: jest.Mock;
let mockUsersDbDeleteById: jest.Mock;
let mockUsersDbupdateUser: jest.Mock;
let mockUsersDbaddUserToTeam: jest.Mock;
let mockUsersDbremoveUserFromTeam: jest.Mock;

let mockTeamsDbGetTeamById: jest.Mock;

jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
  }));

beforeAll(() => {
    mockUsersDbGetAllUsers = jest.fn();
    mockUsersDbGetUserById = jest.fn();
    mockUserDbGetUserByEmail = jest.fn();
    mockUsersDbcreateUser = jest.fn();
    mockUsersDbDeleteById = jest.fn();
    mockUsersDbupdateUser = jest.fn();
    mockUsersDbaddUserToTeam = jest.fn();
    mockUsersDbremoveUserFromTeam = jest.fn();

    mockTeamsDbGetTeamById = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

/*
**********************************************************************************************
**********************************************************************************************
                                getAllUsers
**********************************************************************************************
**********************************************************************************************
*/

test('given users, when getAllUsers is called as admin, then all users are returned', async () => {
    userDb.getAllUsers = mockUsersDbGetAllUsers.mockResolvedValue([user, admin]);
    const users = await userService.getAllUsers({ role: 'admin' });
    expect(users).toEqual([user, admin]);
});

test('given users, when getAllUsers is called as non-admin role, then throw UnauthorizedError', async () => {
    userDb.getAllUsers = mockUsersDbGetAllUsers.mockResolvedValue([]);
    await expect(userService.getAllUsers({ role: 'user' })).rejects.toThrowError(
        new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' })
    );
});


/*
**********************************************************************************************
**********************************************************************************************
                                getUserByid
**********************************************************************************************
**********************************************************************************************
*/

//getUserById as admin

test('given valid user id, when getUserById is called as admin, then return user', async () => {
    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(user);
    const result = await userService.getUserById({ id: 1, currentUser: 2, role: 'admin' });
    expect(result).toEqual(user);
});

test('given non-existing user id, when getUserById is called as admin, then throw Error', async () => {
    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(null);
    await expect(userService.getUserById({ id: 999, currentUser: 2, role: 'admin' })).rejects.toThrowError(
        'User with id 999 does not exist.'
    );
});

//getUserById as user

test('given same logged in user id as the one to be retrieved, when getUserById is called as user, then return user', async () => {
    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(user);
    const result = await userService.getUserById({ id: 1, currentUser: 1, role: 'user' });
    expect(result).toEqual(user);
});

test('given different logged in user id than the one to be retrieved, when getUserById is called as user, then throw UnauthorizedError', async () => {
    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(user);
    await expect(userService.getUserById({ id: 1, currentUser: 2, role: 'user' })).rejects.toThrowError(
        new UnauthorizedError('credentials_required', { message: 'You are not authorized to access this resource.' })
    );
});



/*
**********************************************************************************************
**********************************************************************************************
                                deleteUserById
**********************************************************************************************
**********************************************************************************************
*/

test('given valid user id, when deleteUserById is called as admin, then user is deleted and returned', async () => {
    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(user);
    userDb.deleteUser = mockUsersDbDeleteById.mockResolvedValue(user);
    const deletedUser = await userService.deleteUserById({ id: 1, role: 'admin' });
    expect(deletedUser).toEqual(user);
    expect(mockUsersDbGetUserById).toHaveBeenCalledWith(1);
    expect(mockUsersDbDeleteById).toHaveBeenCalledWith(1);
});

test('given invalid user id, when deleteUserById is called as admin, then error is thrown', async () => {
    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(undefined);
    await expect(userService.deleteUserById({ id: 999, role: 'admin' })).rejects.toThrowError('User with id 999 does not exist.');
    expect(mockUsersDbGetUserById).toHaveBeenCalledWith(999);
    expect(mockUsersDbDeleteById).not.toHaveBeenCalled();
});

test('given valid user id of an admin, when deleteUserById is called as admin, then error is thrown', async () => {
    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(admin);
    await expect(userService.deleteUserById({ id: 2, role: 'admin' })).rejects.toThrowError('You cannot delete an admin user.');
    expect(mockUsersDbGetUserById).toHaveBeenCalledWith(2);
    expect(mockUsersDbDeleteById).not.toHaveBeenCalled();
});


test('given valid user id, when deleteUserById is called as non-admin, then error is thrown', async () => {
    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(user);
    await expect(userService.deleteUserById({ id: 1, role: 'user' })).rejects.toThrowError(
        new UnauthorizedError('credentials_required', { message: 'You are not authorized to delete a user.' })
    );
    expect(mockUsersDbGetUserById).not.toHaveBeenCalledWith();
    expect(mockUsersDbDeleteById).not.toHaveBeenCalled();
});


/*
**********************************************************************************************
**********************************************************************************************
                                createUser
**********************************************************************************************
**********************************************************************************************
*/

test('given valid user fields, when createUser is called, then password is hashed and role "user" is assigned and user is created and returned', async () => {

    userDb.createUser = mockUsersDbcreateUser.mockResolvedValue({...user, password: hashedPassword, role: 'user' });
    const createdUser = await userService.createUser({name: user.name, specialisation: user.specialisation, email: user.email, password: user.password });
    expect(createdUser).toEqual({...user, password: hashedPassword, role: 'user'});
    expect(mockUsersDbcreateUser).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
});

test('given user fields with existing email, when createUser is called, then error is thrown', async () => {
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockResolvedValue(user);
    await expect(userService.createUser({name: 'user99', specialisation: 'Developer', email: 'email1@t.t', password: 'password1' })).rejects.toThrowError(
        'User with email email1@t.t already exists.'
    );
    expect(mockUserDbGetUserByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersDbcreateUser).not.toHaveBeenCalled();
});

test('given user fields with password too short, when createUser is called, then error is thrown', async () => {
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockResolvedValue(null);
    await expect(userService.createUser({name: 'user99', specialisation: 'Developer', email: 'email99@t.t', password: 'short' })).rejects.toThrowError(
        'Password must be at least 7 characters'
    );
    expect(mockUsersDbcreateUser).not.toHaveBeenCalled();
});

/*
**********************************************************************************************
**********************************************************************************************
                                updateUser
**********************************************************************************************
**********************************************************************************************
*/

//updateUser as admin

test('given valid user id and new password and email,' +
' when updateUser is called as admin,' +
' then password is hashed and user is updated and returned', async () => {
    const updatedInfo = {email: 'newEmail@t.t', password: 'newPassword'};

    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(user);
    userDb.updateUser = mockUsersDbupdateUser.mockResolvedValue({...user, ...updatedInfo, password: hashedPassword});

    const updatedUser = await userService.updateUser({ targetUserId: user.id, updatedInfo, currentUser: admin.id, currentRole: 'admin' });

    expect(user.password).not.toEqual(updatedUser.password);
    expect(user.email).not.toEqual(updatedUser.email);
    expect(updatedUser).toEqual({...user, password: hashedPassword, email: updatedInfo.email});
});

test('given non-existing user id, when updateUser is called as admin, then error is thrown', async () => {
    const updatedInfo = { email: 'newEmail@t.t', password: 'newPassword'};

    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(null);
    await expect(userService.updateUser({ targetUserId: 999, updatedInfo, currentUser: admin.id, currentRole: 'admin' })).rejects.toThrowError(
        'User with id 999 does not exist.'
    );
    expect(mockUsersDbupdateUser).not.toHaveBeenCalled();
});

test('given valid user id and new email that is already taken,' +
' when updateUser is called as admin,' +
' then error is thrown', async () => {
    const updatedInfo = { email: 'email2@t.t'};

    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(user);
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockResolvedValue(admin);

    await expect(userService.updateUser({ targetUserId: user.id, updatedInfo, currentUser: admin.id, currentRole: 'admin' })).rejects.toThrowError(
        'User with email email2@t.t already exists.'
    );
    expect(mockUsersDbupdateUser).not.toHaveBeenCalled();
});

test('given valid user id and new password that is too short,' +
' when updateUser is called as admin,' +
' then error is thrown', async () => {
    const updatedInfo = {password: 'short'};

    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(user);
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockResolvedValue(null);

    await expect(userService.updateUser({ targetUserId: user.id, updatedInfo, currentUser: admin.id, currentRole: 'admin' })).rejects.toThrowError(
        'Password must be at least 7 characters'
    );
    expect(mockUsersDbupdateUser).not.toHaveBeenCalled();
});

//updateUser as user

test('given valid user id and new password and email,' +
' when updateUser is called as the user that wants to be updated (currentUser == targetUserId),' +
' then password is hashed and user is updated and returned', async () => {
    const updatedInfo = {email: 'newEmail@t.t', password: 'newPassword'};

    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(user);
    userDb.updateUser = mockUsersDbupdateUser.mockResolvedValue({...user, ...updatedInfo, password: hashedPassword});

    const updatedUser = await userService.updateUser({ targetUserId: user.id, updatedInfo, currentUser: user.id, currentRole: 'user' });

    expect(user.password).not.toEqual(updatedUser.password);
    expect(user.email).not.toEqual(updatedUser.email);
    expect(updatedUser).toEqual({...user, password: hashedPassword, email: updatedInfo.email});
});

test('given valid user id and new password and email,' +
' when updateUser is called as a different user than the one to be updated (currentUser != targetUserId),' +
' then error is thrown', async () => {
    const updatedInfo = {email: 'newEmail@t.t', password: 'newPassword'};

    await expect(userService.updateUser({ targetUserId: 99, updatedInfo, currentUser: user.id, currentRole: 'user' })).rejects.toThrowError(
        new UnauthorizedError('credentials_required', { message: 'You are not authorized to update this resource.' })
    );
    expect(mockUsersDbupdateUser).not.toHaveBeenCalled();

});


/*
**********************************************************************************************
**********************************************************************************************
                                addUserToTeam
**********************************************************************************************
**********************************************************************************************
*/

//addUserToTeam as admin

test('given valid user id and valid team id,' +
' when addUserToTeam is called as admin,' +
' then user is added to team and returned', async () => {
    const team = { id: 1, name: 'team1' };
    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(user);
    teamDb.getTeamById = mockTeamsDbGetTeamById.mockResolvedValue(team);
    userDb.addUserToTeam = mockUsersDbaddUserToTeam.mockResolvedValue({ ...user, teams: [team] });

    const updatedUser = await userService.addUserToTeam({ userId: user.id, teamId: team.id, currentUser: admin.id, role: 'admin' });

    expect(updatedUser.teams).toContainEqual(team);
    expect(updatedUser).toEqual({ ...user, teams: [team] });
});

test('given non-existing user id and valid team id,' +
' when addUserToTeam is called as admin,' +
' then error is thrown', async () => {
    const team = { id: 1, name: 'team1' };
    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(null);
    teamDb.getTeamById = mockTeamsDbGetTeamById.mockResolvedValue(team);


    await expect(userService.addUserToTeam({ userId: 999, teamId: team.id, currentUser: admin.id, role: 'admin' })).rejects.toThrowError(
        'User with id 999 does not exist.'
    );
    expect(mockUsersDbaddUserToTeam).not.toHaveBeenCalled();
});

test('given valid user id and non-existing team id,' +
' when addUserToTeam is called as admin,' +
' then error is thrown', async () => {
    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(user);
    teamDb.getTeamById = mockTeamsDbGetTeamById.mockResolvedValue(null);

    await expect(userService.addUserToTeam({ userId: user.id, teamId: 999, currentUser: admin.id, role: 'admin' })).rejects.toThrowError(
        'Team with id 999 does not exist.'
    );
    expect(mockUsersDbaddUserToTeam).not.toHaveBeenCalled();
});

//addUserToTeam as user

test('given valid user id and valid team id,' +
' when addUserToTeam is called as the user that wants to be added to a team (currentUser == userId),' +
' then user is added to team and returned', async () => {
    const team = { id: 1, name: 'team1' };
    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(user);
    teamDb.getTeamById = mockTeamsDbGetTeamById.mockResolvedValue(team);
    userDb.addUserToTeam = mockUsersDbaddUserToTeam.mockResolvedValue({ ...user, teams: [team] });

    const updatedUser = await userService.addUserToTeam({ userId: user.id, teamId: team.id, currentUser: user.id, role: 'user' });

    expect(updatedUser.teams).toContainEqual(team);
    expect(updatedUser).toEqual({ ...user, teams: [team] });
});

test('given valid user id and valid team id,' +
' when addUserToTeam is called as a different user than the one to be added to a team (currentUser != userId),' +
' then error is thrown', async () => {
    const team = { id: 1, name: 'team1' };
    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(user);
    teamDb.getTeamById = mockTeamsDbGetTeamById.mockResolvedValue(team);

    await expect(userService.addUserToTeam({ userId: 99, teamId: team.id, currentUser: user.id, role: 'user' })).rejects.toThrowError(
        new UnauthorizedError('credentials_required', { message: 'You are not authorized to add another user to a team.' })
    );
    expect(mockUsersDbaddUserToTeam).not.toHaveBeenCalled();
});


/*
**********************************************************************************************
**********************************************************************************************
                                removeUserFromTeam
**********************************************************************************************
**********************************************************************************************
*/


//removeUserFromTeam as admin

test('given valid user id and valid team id,' +
' when removeUserFromTeam is called as admin,' +
' then user is deleted from team and returned', async () => {
    const team = { id: 1, name: 'team1' };
    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(user);
    teamDb.getTeamById = mockTeamsDbGetTeamById.mockResolvedValue(team);
    userDb.removeUserFromTeam = mockUsersDbremoveUserFromTeam.mockResolvedValue({ ...user, teams: [] });

    const updatedUser = await userService.removeUserFromTeam({ userId: user.id, teamId: team.id, currentUser: admin.id, role: 'admin' });

    expect(updatedUser.teams).not.toContain(team);
    expect(updatedUser).toEqual({ ...user, teams: [] });
});

test('given non-existing user id and valid team id,' +
' when removeUserFromTeam is called as admin,' +
' then error is thrown', async () => {
    const team = { id: 1, name: 'team1' };
    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(null);
    teamDb.getTeamById = mockTeamsDbGetTeamById.mockResolvedValue(team);


    await expect(userService.removeUserFromTeam({ userId: 999, teamId: team.id, currentUser: admin.id, role: 'admin' })).rejects.toThrowError(
        'User with id 999 does not exist.'
    );
    expect(mockUsersDbremoveUserFromTeam).not.toHaveBeenCalled();
});

test('given valid user id and non-existing team id,' +
' when removeUserFromTeam is called as admin,' +
' then error is thrown', async () => {
    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(user);
    teamDb.getTeamById = mockTeamsDbGetTeamById.mockResolvedValue(null);

    await expect(userService.removeUserFromTeam({ userId: user.id, teamId: 999, currentUser: admin.id, role: 'admin' })).rejects.toThrowError(
        'Team with id 999 does not exist.'
    );
    expect(mockUsersDbremoveUserFromTeam).not.toHaveBeenCalled();
});


//removeUserFromTeam as user

test('given valid user id and valid team id,' +
' when removeUserFromTeam is called as the user that wants to be removed from a team (currentUser == userId),' +
' then user is deleted from the team and returned', async () => {
    const team = { id: 1, name: 'team1' };
    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(user);
    teamDb.getTeamById = mockTeamsDbGetTeamById.mockResolvedValue(team);
    userDb.removeUserFromTeam = mockUsersDbremoveUserFromTeam.mockResolvedValue({ ...user, teams: [] });

    const updatedUser = await userService.removeUserFromTeam({ userId: user.id, teamId: team.id, currentUser: user.id, role: 'user' });

    expect(updatedUser.teams).not.toContain(team);
    expect(updatedUser).toEqual({ ...user, teams: [] });
});

test('given valid user id and valid team id,' +
' when removeUserFromTeam is called as a different user than the one to be removed from a team (currentUser != userId),' +
' then error is thrown', async () => {
    const team = { id: 1, name: 'team1' };
    userDb.getUserById = mockUsersDbGetUserById.mockResolvedValue(user);
    teamDb.getTeamById = mockTeamsDbGetTeamById.mockResolvedValue(team);

    await expect(userService.removeUserFromTeam({ userId: 99, teamId: team.id, currentUser: user.id, role: 'user' })).rejects.toThrowError(
        new UnauthorizedError('credentials_required', { message: 'You are not authorized to remove another user from a team.' })
    );
    expect(mockUsersDbremoveUserFromTeam).not.toHaveBeenCalled();
});