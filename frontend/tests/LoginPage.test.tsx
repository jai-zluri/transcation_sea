import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { LoginPage } from '../src/components/LoginPage';
import { useAuth } from '../src/context/AuthContext';

// Mock the AuthContext
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('LoginPage', () => {
  const mockSignInWithGoogle = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Setup mock implementation for useAuth
    (useAuth as jest.Mock).mockReturnValue({
      signInWithGoogle: mockSignInWithGoogle,
    });
  });

  test('renders login page correctly', () => {
    render(<LoginPage />);

    // Check for main heading
    expect(screen.getByText('Welcome to Transaction Manager')).toBeInTheDocument();

    // Check for Google sign-in button
    const googleButton = screen.getByRole('button', { name: /sign in with google/i });
    expect(googleButton).toBeInTheDocument();
  });

  test('calls signInWithGoogle when button is clicked', () => {
    render(<LoginPage />);

    // Find and click the Google sign-in button
    const googleButton = screen.getByRole('button', { name: /sign in with google/i });
    fireEvent.click(googleButton);

    // Check that signInWithGoogle was called
    expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
  });

  test('google sign-in button has correct attributes', () => {
    render(<LoginPage />);

    const googleButton = screen.getByRole('button', { name: /sign in with google/i });
    
    // Check button styling and Google logo
    expect(googleButton).toHaveClass('w-full', 'flex', 'items-center', 'justify-center');
    
    const googleLogo = screen.getByAltText('Google logo');
    expect(googleLogo).toBeInTheDocument();
    expect(googleLogo).toHaveAttribute('src', 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg');
  });
});