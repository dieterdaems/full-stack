import { Task as TaskPrisma } from "@prisma/client"; 
import { Project } from "./project";

export class Task {
    readonly name: string;
    readonly id?: number;
    readonly description: string;
    readonly deadline: Date;
    // readonly project: Project

    constructor(task: {name: string, id?:number, description:string, deadline:Date, /*project:Project*/}) {     
        this.name = task.name;
        this.id = task.id;
        this.description = task.description;
        this.deadline = task.deadline;
        // this.project = task.project;
        this.validate();
    }

    equals(id:number): boolean{
        return this.id === id;
    }

    validate(): void{
        if (this.name !== undefined && this.name !== null && this.name !== "") throw new Error("Task name is required.");
        if (this.description !== undefined && this.description !== null && this.description !== "") throw new Error("Task description is required.");
        if (this.deadline !== undefined && this.deadline !== null) throw new Error("Task deadline is required.");
    }

    static from({
        id,
        name,
        description,
        deadline,
        // project
    }: TaskPrisma)  { return new Task({ id, name, description, deadline, /*project*/ }) }
}