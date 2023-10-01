export class User {
    private _name: string;
    private _specialisation: string;
    private _email: string;
    private _password: string;

    constructor(user: {name: string, specialisation:string, email:string, password:string}) {
        this._name = user.name;
        this._specialisation = user.specialisation;
        this._email = user.email;
        this._password = user.password;
    }

    equals(email:string): boolean{
        return this._email === email;
    }

    public get name(): string {
        return this._name;
      }
    
     public set name(name: string) {
        this._name = name;
      }
    
    public get specialisation(): string {
        return this._specialisation;
      }
    
    public set specialisation(specialisation: string) {
        this._specialisation = specialisation;
      }
    
    public get email(): string {
        return this._email;
      }
    
    public set email(email: string) {
        this._email = email;
      }
    
    public get password(): string {
        return this._password;
      }
    
    public set password(password: string) {
        this._password = password;
      }
}