import { User } from "./user";

export class Team {
    readonly name: string;
    readonly users: Array<User>;
    readonly id?: number;

    constructor(team: {name: string, users: User[], id? :number}) {
        this.name = team.name;
        this.users = team.users;
        this.id = team.id;
    }

    equals(team: Team): boolean{
        return this.name === team.name;
    }

    addUserToTeam(user: User): void{
        if (this.users.includes(user))
        {
            throw new Error("User already in team");
        }
        this.users.push(user);
    }
}

 