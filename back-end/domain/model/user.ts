import { User as UserPrisma} from "@prisma/client"; 
import { Role } from "../../types";

export class User {
    readonly id?: number;
    readonly name: string;
    readonly specialisation: string;
    readonly email: string;
    readonly password: string;
    readonly role:  Role

    constructor(user: {name: string, specialisation:string, email:string, password:string, id?:number, role?:Role}) {
        this.validate(user);

        this.name = user.name;
        this.specialisation = user.specialisation;
        this.email = user.email;
        this.password = user.password;
        this.id = user.id;
        this.role = user.role;
    }

    isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validate(user: {name: string, specialisation:string, email:string, password:string}) {
        if (!user.name?.trim()) throw new Error('Name is required');
        if (!user.specialisation?.trim()) throw new Error('Specialisation is required');
        if (!user.email?.trim()) throw new Error('Email is required');
        if (!this.isValidEmail(user.email)) throw new Error('Invalid email format');
        if (!user.password?.trim()) throw new Error('Password is required');
        if (user.password.length < 7) throw new Error('Password must be at least 7 characters');
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
        role,
    }: UserPrisma ) {
        return new User(
            { id,
            name,
            specialisation,
            email,
            password,
            role: role as Role,
        })
    }

}