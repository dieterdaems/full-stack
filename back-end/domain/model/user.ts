import { User as UserPrisma} from "@prisma/client"; 

export class User {
    readonly id?: number;
    readonly name: string;
    readonly specialisation: string;
    readonly email: string;
    readonly password: string;

    constructor(user: {name: string, specialisation:string, email:string, password:string, id?:number}) {
        this.name = user.name;
        this.specialisation = user.specialisation;
        if (!this.isValidEmail(user.email)) throw new Error('Invalid email format');
        this.email = user.email;
        this.password = user.password;
        this.id = user.id;
    }

    isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    equals(email:string): boolean{
        return this.email === email;
    }

    static from ({
        id,
        name,
        specialisation,
        email,
        password,
    }: UserPrisma ) {
        return new User(
            { id,
            name,
            specialisation,
            email,
            password,
        })
    }

}