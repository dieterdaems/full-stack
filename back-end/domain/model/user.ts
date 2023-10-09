export class User {
    readonly name: string;
    readonly specialisation: string;
    readonly email: string;
    readonly password: string;

    constructor(user: {name: string, specialisation:string, email:string, password:string}) {
        this.name = user.name;
        this.specialisation = user.specialisation;
        this.email = user.email;
        this.password = user.password;
    }

    equals(email:string): boolean{
        return this.email === email;
    }
}