import { User } from "./user";

export class Team {
    readonly name: string;
    readonly id: number;
    readonly users: Array<User>;

    constructor(team: {name: string, id:number, users:Array<User>}) {
        this.name = team.name;
        this.id = team.id;
        this.users = team.users;
    }

    equals(id:number): boolean{
        return this.id === id;
    }
}

 