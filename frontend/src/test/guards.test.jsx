import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/guards/ProtectedRoute';
import RoleRoute from '../components/guards/RoleRoute';

const makeStore = (auth) =>
  configureStore({ reducer: { auth: () => auth } });

const renderWithAuth = (auth, ui) =>
  render(
    <Provider store={makeStore(auth)}>
      <MemoryRouter initialEntries={['/secure']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/" element={<div>Home Page</div>} />
          {ui}
        </Routes>
      </MemoryRouter>
    </Provider>
  );

describe('security route guards (RBAC)', () => {
  it('redirects unauthenticated users to login', () => {
    renderWithAuth({ user: null, profile: null }, (
      <Route element={<ProtectedRoute />}>
        <Route path="/secure" element={<div>Secret</div>} />
      </Route>
    ));
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects deactivated users to login', () => {
    renderWithAuth({ user: { uid: 'u1' }, profile: { role: 'STUDENT', active: false } }, (
      <Route element={<ProtectedRoute />}>
        <Route path="/secure" element={<div>Secret</div>} />
      </Route>
    ));
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('allows authenticated active users through ProtectedRoute', () => {
    renderWithAuth({ user: { uid: 'u1' }, profile: { role: 'STUDENT', active: true } }, (
      <Route element={<ProtectedRoute />}>
        <Route path="/secure" element={<div>Secret</div>} />
      </Route>
    ));
    expect(screen.getByText('Secret')).toBeInTheDocument();
  });

  it('blocks students from admin-only routes (privilege escalation)', () => {
    renderWithAuth({ user: { uid: 'u1' }, profile: { role: 'STUDENT', active: true } }, (
      <Route element={<RoleRoute roles={['ADMIN']} />}>
        <Route path="/secure" element={<div>Admin Area</div>} />
      </Route>
    ));
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('admits matching roles through RoleRoute', () => {
    renderWithAuth({ user: { uid: 'u1' }, profile: { role: 'ADMIN', active: true } }, (
      <Route element={<RoleRoute roles={['ADMIN']} />}>
        <Route path="/secure" element={<div>Admin Area</div>} />
      </Route>
    ));
    expect(screen.getByText('Admin Area')).toBeInTheDocument();
  });
});
