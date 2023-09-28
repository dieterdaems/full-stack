import { User } from "../../model/user";

const users: User[] = [
    new User({name: 'Stijnje', spec: 'niks', email: 'stijne-alex', pass: 't'}),
    new User({name: 'Love', spec: 'curry', email: 'love-curry', pass:'t'})
,
];

const getAllUsers = (): User[] => users;
const getUserByEmail = (email: string) : User => users.find((u) => u.email === email);

export default { getAllUsers, getUserByEmail};
