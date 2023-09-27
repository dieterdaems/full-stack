export class User {
    readonly name: string;

    constructor(user: {name: string}) {
        this.name = user.name;
    }

    equals(name:string): boolean{
        return name === this.name;
    }


}