import { User } from "./user";

export class Team {
    private _name: string;
    private _id: number;
    private _users: Array<User>;

    constructor(team: {name: string, id:number, users:Array<User>}) {
        this._name = team.name;
        this._id = team.id;
        this._users = team.users;
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

    public get users(): Array<User> {
        return this._users;
      }

    public set users(users: Array<User>) {
        this._users = users;
      }
      


}

 