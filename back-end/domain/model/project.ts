import { Team } from "./team";
import { Project as ProjectPrisma } from "@prisma/client";

export class Project {
    readonly name: string;
    readonly id?: number;
    // readonly team?: Team;



    constructor(project: {name: string, id?:number}) {     
        this.name = project.name;
        this.id = project.id;
        // this.team = project.team;
    }

    equals(pproject: Project): boolean{
        return this.name === pproject.name;
    }

    static from({
        id,
        name,
        // team
    }: ProjectPrisma)  { return new Project({ id, name }) }
        

  }