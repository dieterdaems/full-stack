export class User {
    readonly id?: number;
    readonly name: string;
    readonly specialisation: string;
    readonly email: string;
    readonly password: string;

    constructor(user: {name: string, specialisation:string, email:string, password:string, id?:number}) {
        this.name = user.name;
        this.specialisation = user.specialisation;
        this.email = user.email;
        this.password = user.password;
        this.id = user.id;
    }

    equals(email:string): boolean{
        return this.email === email;
    }
}