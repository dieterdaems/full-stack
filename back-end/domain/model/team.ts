import { Team as TeamPrisma } from "@prisma/client"; 

export class Team {
    readonly name: string;
    readonly id?: number;

    constructor(team: {name: string, id? :number}) {
        if (!team.name?.trim()) throw new Error('Team name is required');
        this.name = team.name.trim().toLowerCase();
        this.id = team.id;
    }

    equals(team: Team): boolean{
        return this.name === team.name;
    }

    static from ({
        name,
        id
    }: TeamPrisma ) {
        return new Team(
            {
            name,
            id
        })
    }
}

 