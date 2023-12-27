import { User } from "./user";
import { Team as TeamPrisma, User as UserPrisma } from "@prisma/client"; 

export class Team {
    readonly name: string;
    readonly users: Array<User>;
    readonly id?: number;

    constructor(team: {name: string, users: User[], id? :number}) {
        if (!team.name?.trim()) throw new Error('Name is required');
        this.name = team.name;
        this.users = team.users;
        this.id = team.id;
    }

    equals(team: Team): boolean{
        return this.name === team.name;
    }

    static from ({
        name,
        users,
        id
    }: TeamPrisma & {users: UserPrisma[]}) {
        return new Team(
            {
            name,
            users : users.map((user) => User.from(user)),
            id
        })
    }
}

 