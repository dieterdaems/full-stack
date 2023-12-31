import { Team } from "./team";
import { Project as ProjectPrisma } from "@prisma/client";
import { Team as TeamPrisma } from "@prisma/client";

export class Project {
    readonly name: string;
    readonly id?: number;
    readonly team?: Team;



    constructor(project: {name: string, id?:number, team?: Team}) {
        this.validate(project); 
        this.name = project.name;
        this.id = project.id;
        this.team = project.team;
    }

    equals(pproject: Project): boolean{
        return this.name === pproject.name;
    }

    validate(project): void{
        if (project.name == undefined || project.name == null || project.name == "") throw new Error("Project name is required.");
    }

    static from({
        id,
        name,
        team
    }: ProjectPrisma & {team: TeamPrisma})  { return new Project({ id, name, team: Team.from(team) }) }
        

  }