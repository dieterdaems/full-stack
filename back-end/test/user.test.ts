import { User } from "../domain/model/user"

test('Given: valid name for user, When: user is created, Then:user is created with valid name',() => {
    const validName: string = "jan"
    const user: User = new User({name: validName}); 
    expect(user.name).toEqual(validName);
}
)