import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';

const store = configureStore({
  reducer: { auth: () => ({ user: null, profile: null, loading: false, error: null }) },
});

describe('LoginPage (UI test)', () => {
  it('renders email and password fields', () => {
    render(
      <Provider store={store}><MemoryRouter><LoginPage /></MemoryRouter></Provider>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors instead of submitting invalid input', async () => {
    render(
      <Provider store={store}><MemoryRouter><LoginPage /></MemoryRouter></Provider>
    );
    await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    expect(screen.getByText(/required/i)).toBeInTheDocument();
  });
});
