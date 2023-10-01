import { Team } from "./team";

export class Project {
    private _name: string;
    private _id: number;
    private _team: Team;

    constructor(project: {name: string, id:number, team:Team}) {     
        this._name = project.name;
        this._id = project.id;
        this._team = project.team;
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

    public get team(): Team {
        return this._team;
      }

    public set team(team: Team) {
        this._team = team;
      }
}