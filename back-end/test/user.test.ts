import { User } from "../domain/model/user"

test('Given: valid data for user, When: user is created, Then:user is created with valid name',() => {
    const validName: string = "jan";
    const validSpecialisation: string = "developer";
    const validEmail: string = "jan@developer.be";
    const validPassword: string = "jan123";
    const user: User = new User({name: validName, specialisation: validSpecialisation, email: validEmail, password: validPassword}); 
    expect(user.name).toEqual(validName);
    expect(user.specialisation).toEqual(validSpecialisation);
    expect(user.email).toEqual(validEmail);
    expect(user.password).toEqual(validPassword);
}
)
