import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from 'react-router-dom';
import { Login } from './Login';


it('should allow users to submit their credentials', () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )

  const usernameField = screen.getByLabelText(/Username/i);
  const passwordField = screen.getByLabelText(/Password/i);
  const loginButton = screen.getByText(/Log In/i);

  userEvent.type(usernameField, "awoodham")
  userEvent.type(passwordField, "passwor11d")
  userEvent.click(loginButton)
  

})