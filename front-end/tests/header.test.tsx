import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from 'next/router';
import Header from "../components/header";
import React from "react";

window.React = React;


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

