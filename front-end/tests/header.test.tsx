import Header from '@/components/header';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import React from 'react';


window.React = React;

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
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

describe('Header', () => {
  it('shows the correct links when logged in as admin', () => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/',
      query: {},
      asPath: '/',
    });
    sessionStorage.setItem('loggedUser', 'admin');
    sessionStorage.setItem('role', '91fb3f8394dead2470aaf953e1bed9d9abf34a41f65ac666cff414ca229245b8');
    render(<Header />);
    expect(screen.getByText('Users'))
    expect(screen.getByText('Teams'))
    expect(screen.getByText('Projects'))
    expect(screen.getByText('Profile'))
    expect(screen.getByText('Logout'))
  });

  it('shows the correct links when logged in as non-admin', () => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/',
      query: {},
      asPath: '/',
    });
    sessionStorage.setItem('loggedUser', 'user');
    sessionStorage.setItem('role', '4b975fd8f0ff3e9fe958e701d5053be7dc223b684ec633f3d322d8868d395d33');
    render(<Header />);
    expect(screen.getByText('Teams'))
    expect(screen.getByText('Projects'))
    expect(screen.getByText('Profile'))
    expect(screen.getByText('Logout'))
  });

  it('shows the correct links when not logged in', () => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/',
      query: {},
      asPath: '/',
    });
    sessionStorage.clear();
    render(<Header />);
    expect(screen.getByText('Home'))
    expect(screen.queryByText('Login'))
    expect(screen.queryByText('Register'))
  });
});