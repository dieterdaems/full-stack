import { User } from "../../model/user";

const users: User[] = [
    new User({name: 'Stijnje', specialisation: 'Ai', email: 'stijn@test.be', password: 't'}),
    new User({name: 'Sander', specialisation: 'Backend', email: 'sander@test.be', password:'t'})
,
];

const getAllUsers = (): User[] => users;
const getUserByEmail = (email: string) : User => users.find((u) => u.email === email);

export default { getAllUsers, getUserByEmail};
