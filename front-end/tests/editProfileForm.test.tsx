import UserService from '@/services/UserService';
import EditProfileForm from '../components/users/EditProfileForm';
import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';

const user = {
    id: 1,
    name: "string",
    specialisation: "string",
    email: "user@example.com",
    password: "$2b$12$1utHCyek7tFYeIo04c0v0eecaXlI7iFlKGtozOwwmFWIo/8M8EHZG",
    role: "admin",
    teams: [
      {
        name: "string",
        id: 1
      }
    ]
  };

  window.React = React;

  jest.mock('@/services/UserService');

  test('renders correctly', () => {
    render(<EditProfileForm user={user} />);

    expect(screen.getByLabelText('Name'))
    expect(screen.getByLabelText('Email'))
    expect(screen.getByLabelText('Specialisation'))
    expect(screen.getByText('Update'))
  });
  
  test('calls the onSubmit function with the updated data when submitted', async () => {
    UserService.update = jest.fn();
    (UserService.update as jest.Mock).mockResolvedValue({ ok: true, statusText: 'Updated successfully' });
  
    render(<EditProfileForm user={user} />);

    await act(async () => {
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane.doe@example.com' } });
    fireEvent.change(screen.getByLabelText('Specialisation'), { target: { value: 'Data Scientist' } });
    
    fireEvent.submit(screen.getByRole('button', { name: /update/i }));
  });
  
    expect(UserService.update).toHaveBeenCalledWith({
      id: user.id,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      specialisation: 'Data Scientist',
    });
  });

  test('shows an error message when no name is entered', async () => {
    UserService.update = jest.fn();
    (UserService.update as jest.Mock).mockResolvedValue({ ok: false, statusText: 'Bad request' });
  
    render(<EditProfileForm user={user} />);
  
    await act(async () => {
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane.doe@example.com' } });
    fireEvent.change(screen.getByLabelText('Specialisation'), { target: { value: 'Data Scientist' } });

    fireEvent.submit(screen.getByRole('button', { name: /update/i }));
    });

    expect(screen.getByText('Name is required'));
  });

  test('shows an error message when no email is entered', async () => {
    UserService.update = jest.fn();
    (UserService.update as jest.Mock).mockResolvedValue({ ok: false, statusText: 'Bad request' });
  
    render(<EditProfileForm user={user} />);
  
    await act(async () => {
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Specialisation'), { target: { value: 'Data Scientist' } });

    fireEvent.submit(screen.getByRole('button', { name: /update/i }));
    });
    
    expect(screen.getByText('Email is required'));
  });

  test('shows an error message when no specialisation is entered', async () => {
    UserService.update = jest.fn();
    (UserService.update as jest.Mock).mockResolvedValue({ ok: false, statusText: 'Bad request' });
  
    render(<EditProfileForm user={user} />);
    
    await act(async () => {
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane.doe@example.com' } });
    fireEvent.change(screen.getByLabelText('Specialisation'), { target: { value: '' } });

    fireEvent.submit(screen.getByRole('button', { name: /update/i }));
    });

    expect(screen.getByText('Specialisation is required'));
  });

  test('shows an error message when incorrect email is entered', async () => {
    UserService.update = jest.fn();
    (UserService.update as jest.Mock).mockResolvedValue({ ok: false, statusText: 'Bad request' });
  
    render(<EditProfileForm user={user} />);
  
    await act(async () => {
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'norealemail' } });
    fireEvent.change(screen.getByLabelText('Specialisation'), { target: { value: 'Data Scientist' } });

    fireEvent.submit(screen.getByRole('button', { name: /update/i }));
    });

    expect(screen.getByText('Invalid Email format'));
  });
