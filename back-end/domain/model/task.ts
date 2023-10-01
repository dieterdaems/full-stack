import { Project } from "./project";

export class Task {
    private _name: string;
    private _id: number;
    private _description: string;
    private _deadline: Date;
    private _project: Project

    constructor(task: {name: string, id:number, description:string, deadline:Date, project:Project}) {     
        this._name = task.name;
        this._id = task.id;
        this._description = task.description;
        this._deadline = task.deadline;
        this._project = task.project;
    }

    equals(id:number): boolean{
        return this._id === id;
    }

    public get name(): string {
        return this._name;
      }
    
     public set name(name: string) {
        this._name = name;
      }

    public get id(): number {
        return this._id;
      }
    
    public set id(id: number) {
        this._id = id;
      }

    public get description(): string {
        return this._description;
      }

    public set description(description: string) {
        this._description = description;
      }

    public get deadline(): Date {
        return this._deadline;
      }
    
    public set deadline(deadline: Date) {
        this._deadline = deadline;
      }

    public get project(): Project {
        return this._project;
      }

    public set project(project: Project) {
        this._project = project;
      }

    
}