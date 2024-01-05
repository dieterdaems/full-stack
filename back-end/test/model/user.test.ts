import { User } from "../../domain/model/user"
import { Team } from "../../domain/model/team";

describe('User Model', () => {
  const validUserData = {
    id: 1,
    name: 'Jan Janssens',
    specialisation: 'Developer',
    email: 'jan.janssens@example.com',
    password: 'securePassword',
  };


  test('Given valid data, when creating a user, then user is created with valid properties', () => {
    const user = new User(validUserData);

    expect(user.id).toEqual(validUserData.id);
    expect(user.name).toEqual(validUserData.name);
    expect(user.specialisation).toEqual(validUserData.specialisation);
    expect(user.email).toEqual(validUserData.email);
    expect(user.password).toEqual(validUserData.password);
  });

  test('Given missing name, when creating a user, then throw an error', () => {
    const invalidUserData = { ...validUserData, name: '' };

    expect(() => new User(invalidUserData)).toThrowError('Name is required');
  });

  test('Given missing specialisation, when creating a user, then throw an error', () => {
    const invalidUserData = { ...validUserData, specialisation: '' };

    expect(() => new User(invalidUserData)).toThrowError('Specialisation is required');
  });

  test('Given missing email, when creating a user, then throw an error', () => {
    const invalidUserData = { ...validUserData, email: '' };

    expect(() => new User(invalidUserData)).toThrowError('Email is required');
  });

  test('Given invalid email, when creating a user, then throw an error', () => {
    const invalidUserData = { ...validUserData, email: 'invalid-email@' };

    expect(() => new User(invalidUserData)).toThrowError('Invalid email format');
  });


  test('Given missing password, when creating a user, then throw an error', () => {
    const invalidUserData = { ...validUserData, password: '' };

    expect(() => new User(invalidUserData)).toThrowError('Password is required');
  });

  test('Given short password, when creating a user, then throw an error', () => {
    const invalidUserData = { ...validUserData, password: 'short' };

    expect(() => new User(invalidUserData)).toThrowError('Password must be at least 7 characters');
  });


});