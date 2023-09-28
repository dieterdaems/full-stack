export class User {
    name: string;
    specialisation: string;
    email: string;
    password: string;

    constructor(user: {name: string, spec:string, email:string, pass:string}) {
        this.name = user.name;
        this.specialisation = user.spec;
        this.email = user.email;
        this.password = user.pass;
    }

    equals(email:string): boolean{
        return this.email === email;
    }


}