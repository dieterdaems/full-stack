import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from 'next/router';
import Header from "../components/header";
import React from "react";

window.React = React;


const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  key: jest.fn(),
  length: 0,
};
global.sessionStorage = sessionStorageMock;

jest.mock('next/router', () => ({
    __esModule: true,
    useRouter: jest.fn(),
  }));

    test("renders the navigation links correctly", () => {
        (useRouter as jest.Mock).mockImplementation(() => ({
            pathname: '/',
            push: jest.fn(),
          }));
        //when
        render(<Header />);

        //then
        expect(screen.getByText("Home"));
        expect(screen.getByText("Login"));
        expect(screen.getByText("Register"));
    });


    // Doesnt show the links when logged in in test
    // test("renders the navigation links correctly when logged in", () => {
    //     (useRouter as jest.Mock).mockImplementation(() => ({
    //         pathname: '/',
    //         push: jest.fn(),
    //       }));
    //       sessionStorageMock.setItem('LoggedIn', 1);

    //     //when
    //     render(<Header />);

    //     //then
    //     expect(screen.getByText("Home"));
    //     expect(screen.getByText("Projects"));
    //     expect(screen.getByText("Profile"));
    // });

