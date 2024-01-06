import UserService from '@/services/UserService';
import EditProfileForm from '../components/users/EditProfileForm';
import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { useTranslation } from 'next-i18next';

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

  jest.mock('react-i18next', () => ({
    useTranslation: () => {
      return {
        t: (str: any) => str,
        i18n: {
          changeLanguage: () => new Promise(() => {}),
        },
      };
    },
    initReactI18next: {
      type: '3rdParty',
      init: () => {},
    }
  }));



  test('renders correctly', () => {
    const { t } = useTranslation();
    render(<EditProfileForm user={user} />);

    expect(screen.getByLabelText(t('users.name')))
    expect(screen.getByLabelText(t('users.email')))
    expect(screen.getByLabelText(t('users.specialization')))
    expect(screen.getByText(t('users.profile.save')))
  });
  
  test('calls the onSubmit function with the updated data when submitted', async () => {
    const { t } = useTranslation();
    UserService.update = jest.fn();
    (UserService.update as jest.Mock).mockResolvedValue({ ok: true, statusText: 'Updated successfully' });
  
    render(<EditProfileForm user={user} />);

    await act(async () => {
    fireEvent.change(screen.getByLabelText(t('users.name')), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(t('users.email')), { target: { value: 'jane.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(t('users.specialization')), { target: { value: 'Data Scientist' } });
    
    fireEvent.submit(screen.getByTestId('update'));
  });
  
    expect(UserService.update).toHaveBeenCalledWith({
      id: user.id,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      specialisation: 'Data Scientist',
    });
  });

  test('shows an error message when no name is entered', async () => {
    const { t } = useTranslation();
    UserService.update = jest.fn();
    (UserService.update as jest.Mock).mockResolvedValue({ ok: false, statusText: 'Bad request' });
  
    render(<EditProfileForm user={user} />);
  
    await act(async () => {
    fireEvent.change(screen.getByLabelText(t('users.name')), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(t('users.email')), { target: { value: 'jane.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(t('users.specialization')), { target: { value: 'Data Scientist' } });

    // fireEvent.submit(screen.getByRole('button', { name: /update/i })); -> this looks for button with name update
    fireEvent.submit(screen.getByTestId('update'));
    });

    expect(screen.getByText(t('users.errorName')));
  });

  test('shows an error message when no email is entered', async () => {
    const { t } = useTranslation();
    UserService.update = jest.fn();
    (UserService.update as jest.Mock).mockResolvedValue({ ok: false, statusText: 'Bad request' });
  
    render(<EditProfileForm user={user} />);
  
    await act(async () => {
    fireEvent.change(screen.getByLabelText(t('users.name')), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(t('users.email')), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(t('users.specialization')), { target: { value: 'Data Scientist' } });

    fireEvent.submit(screen.getByTestId('update'));
    });
    
    expect(screen.getByText(t('users.errorEmail')));
  });

  test('shows an error message when no specialisation is entered', async () => {
    const { t } = useTranslation();
    UserService.update = jest.fn();
    (UserService.update as jest.Mock).mockResolvedValue({ ok: false, statusText: 'Bad request' });
  
    render(<EditProfileForm user={user} />);
    
    await act(async () => {
    fireEvent.change(screen.getByLabelText(t('users.name')), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(t('users.email')), { target: { value: 'jane.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(t('users.specialization')), { target: { value: '' } });

    fireEvent.submit(screen.getByTestId('update'));
    });

    expect(screen.getByText(t('users.errorSpecialization')));
  });

  test('shows an error message when incorrect email is entered', async () => {
    const { t } = useTranslation();
    UserService.update = jest.fn();
    (UserService.update as jest.Mock).mockResolvedValue({ ok: false, statusText: 'Bad request' });
  
    render(<EditProfileForm user={user} />);
  
    await act(async () => {
    fireEvent.change(screen.getByLabelText(t('users.name')), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(t('users.email')), { target: { value: 'norealemail' } });
    fireEvent.change(screen.getByLabelText(t('users.specialization')), { target: { value: 'Data Scientist' } });

    fireEvent.submit(screen.getByTestId('update'));
    });

    expect(screen.getByText(t('users.errorEmailFormat')));
  });
