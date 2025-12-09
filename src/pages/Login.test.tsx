import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

// Mock the store
jest.mock('@/store/useStore', () => ({
  useStore: () => ({
    login: jest.fn((email: string, _password: string) => {
      return email === 'test@example.com';
    }),
  }),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Page', () => {
  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it('renders login form', () => {
    const { getByText, getByLabelText, getByRole } = renderLogin();
    
    expect(getByText('Sign in to StreamTube')).toBeInTheDocument();
    expect(getByLabelText(/email/i)).toBeInTheDocument();
    expect(getByLabelText(/password/i)).toBeInTheDocument();
    expect(getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows link to register page', () => {
    const { getByText, getByRole } = renderLogin();
    
    expect(getByText(/don't have an account/i)).toBeInTheDocument();
    expect(getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('renders email input field', () => {
    const { getByLabelText } = renderLogin();
    
    const emailInput = getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('renders password input field', () => {
    const { getByLabelText } = renderLogin();
    
    const passwordInput = getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('has correct link to register page', () => {
    const { getByRole } = renderLogin();
    
    const signUpLink = getByRole('link', { name: /sign up/i });
    expect(signUpLink).toHaveAttribute('href', '/register');
  });
});
