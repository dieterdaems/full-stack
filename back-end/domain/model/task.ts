import { Project } from "./project";

export class Task {
    readonly name: string;
    readonly id: number;
    readonly description: string;
    readonly deadline: Date;
    readonly project: Project

    constructor(task: {name: string, id:number, description:string, deadline:Date, project:Project}) {     
        this.name = task.name;
        this.id = task.id;
        this.description = task.description;
        this.deadline = task.deadline;
        this.project = task.project;
    }

    equals(id:number): boolean{
        return this.id === id;
    }
}