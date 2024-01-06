import Header from '@/components/header';
import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';


window.React = React;

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

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

beforeEach(() => {
  const mockPush = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({
    pathname: '/',
    query: {},
    asPath: '/',
    push: mockPush,
  });
});

afterEach(() => {
  sessionStorage.clear();
}
);


describe('Header', () => {
  it('shows the correct links when logged in as admin', () => {
    const { t } = useTranslation();
    sessionStorage.setItem('loggedUser', 'admin');
    sessionStorage.setItem('role', '91fb3f8394dead2470aaf953e1bed9d9abf34a41f65ac666cff414ca229245b8');
    render(<Header />);
    expect(screen.getByText(t('header.nav.home')))
    expect(screen.getByText(t('header.nav.users')))
    expect(screen.getByText(t('header.nav.projects')))
    expect(screen.getByText(t('header.nav.logout')))
    expect(screen.getByText(t('header.nav.profile')))
    expect(screen.getByText(t('header.nav.teams')))
  });

  it('shows the correct links when logged in as non-admin', () => {
    const { t } = useTranslation();
    sessionStorage.setItem('loggedUser', 'user');
    sessionStorage.setItem('role', '4b975fd8f0ff3e9fe958e701d5053be7dc223b684ec633f3d322d8868d395d33');
    render(<Header />);
    expect(screen.getByText(t('header.nav.home')))
    expect(screen.getByText(t('header.nav.teams')))
    expect(screen.getByText(t('header.nav.projects')))
    expect(screen.getByText(t('header.nav.profile')))
    expect(screen.getByText(t('header.nav.logout')))
    expect(screen.getByText(t('header.nav.teams')))
  });

  it('shows the correct links when not logged in', () => {
    const { t } = useTranslation();
    sessionStorage.clear();
    render(<Header />);
    expect(screen.getByText(t('header.nav.home')))
    expect(screen.getByText(t('header.nav.login')))
    expect(screen.getByText(t('header.nav.register')))
  });


  it('redirects to the login page when "Login" link is clicked', () => {
    sessionStorage.clear();
    render(<Header />);
    const { t } = useTranslation();
    
  const loginLink = screen.getByTestId('login');

  const hrefValue = loginLink.getAttribute('href');

  expect(hrefValue).toEqual('/login');
    // fireEvent.click(screen.getByTestId('login'));
    // expect(useRouter().push).toHaveBeenCalledWith('/login');
});

});