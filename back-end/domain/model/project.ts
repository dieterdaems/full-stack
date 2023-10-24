import { Team } from "./team";

export class Project {
    readonly name: string;
    readonly id?: number;
    readonly team: Team;



    constructor(project: {name: string, id?:number, team:Team}) {     
        this.name = project.name;
        this.id = project.id;
        this.team = project.team;
    }

    equals(id:number): boolean{
        return this.id === id;
    }

  }