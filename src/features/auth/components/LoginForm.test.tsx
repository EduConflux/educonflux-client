import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from './LoginForm';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn(),
  }),
}));

vi.mock('../hooks/useAuthMutations', () => ({
  useLoginMutation: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
  }),
}));

describe('LoginForm Component', () => {
  const onNavigate = vi.fn();

  it('renders email and password inputs and role selector', () => {
    render(<LoginForm onNavigate={onNavigate} />);

    expect(screen.getByPlaceholderText(/name@educonflux\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in as/i })).toBeInTheDocument();
  });

  it('displays validation errors when submitting with empty credentials', () => {
    render(<LoginForm onNavigate={onNavigate} />);

    const submitBtn = screen.getByRole('button', { name: /Sign in as/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Email address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
  });

  it('displays validation error when entering short password', () => {
    render(<LoginForm onNavigate={onNavigate} />);

    const emailInput = screen.getByPlaceholderText(/name@educonflux\.com/i);
    const passwordInput = screen.getByPlaceholderText('••••••••');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });

    const submitBtn = screen.getByRole('button', { name: /Sign in as/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
  });
});
