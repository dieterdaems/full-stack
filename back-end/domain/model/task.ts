import { Task as TaskPrisma, Project as ProjectPrisma } from "@prisma/client"; 
import { Team as TeamPrisma } from "@prisma/client";
import { User as UserPrisma } from "@prisma/client";
import { Project } from "./project";
import { User } from "./user";

export class Task {
    readonly name: string;
    readonly id?: number;
    readonly description: string;
    readonly deadline: Date;
    readonly project?: Project
    readonly completed?: boolean;
    readonly user?: User;

    constructor(task: {name: string, id?:number, description:string, deadline:Date, project?:Project, completed?:boolean, user?:User}) {     
        this.validate(task);
        this.name = task.name;
        this.id = task.id;
        this.description = task.description;
        this.deadline = task.deadline;
        this.project = task.project;
        this.completed = task.completed;
        this.user = task.user;
    }

    equals(id:number): boolean{
        return this.id === id;
    }

    validate(task): void{
        if (task.name == undefined || task.name == null || task.name == "") throw new Error("Task name is required.");
        if (task.description == undefined || task.description == null || task.description == "") throw new Error("Task description is required.");
        if (task.deadline == undefined || task.deadline == null) throw new Error("Task deadline is required.");
    }

    static from({
        id,
        name,
        description,
        deadline,
        project,
        completed,
    }: TaskPrisma & { project: ProjectPrisma & { team: TeamPrisma }})  { 
        return new Task(
            { id,
            name,
            description,
            deadline,
            project: Project.from(project),
            completed
        })
    }
}