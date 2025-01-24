import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { auth } from '../src/config/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';


jest.mock('../config/firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn(),
  },
}));

jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
}));

describe('AuthContext', () => {
  const mockUser = { uid: '123', email: 'test@example.com' };

  const MockComponent = () => {
    const { user, signInWithGoogle, logout } = useAuth();

    return (
      <div>
        <div>User: {user?.email || 'No User'}</div>
        <button onClick={signInWithGoogle}>Sign In</button>
        <button onClick={logout}>Logout</button>
      </div>
    );
  };

  const renderWithProvider = () =>
    render(
      <AuthProvider>
        <MockComponent />
      </AuthProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initially sets user to null and updates on auth state change', async () => {
    const onAuthStateChangedMock = jest.fn((callback) => {
      callback(mockUser);
      return jest.fn();
    });

    (auth.onAuthStateChanged as jest.Mock).mockImplementation(onAuthStateChangedMock);

    const { getByText } = renderWithProvider();

    await waitFor(() => {
      expect(getByText('User: test@example.com')).toBeInTheDocument();
    });
  });

  test('signInWithGoogle signs in a user successfully', async () => {
    const signInWithPopupMock = jest.fn().mockResolvedValue({ user: mockUser });
    (signInWithPopup as jest.Mock).mockImplementation(signInWithPopupMock);

    const { getByText } = renderWithProvider();

    const signInButton = getByText('Sign In');
    act(() => {
      signInButton.click();
    });

    await waitFor(() => {
      expect(signInWithPopupMock).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
    });
  });

  test('signInWithGoogle handles sign-in errors', async () => {
    const signInWithPopupMock = jest.fn().mockRejectedValue(new Error('Sign-in failed'));
    (signInWithPopup as jest.Mock).mockImplementation(signInWithPopupMock);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText } = renderWithProvider();

    const signInButton = getByText('Sign In');
    act(() => {
      signInButton.click();
    });

    await waitFor(() => {
      expect(signInWithPopupMock).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error signing in with Google:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  test('logout signs out a user successfully', async () => {
    const signOutMock = jest.fn().mockResolvedValue({});
    (auth.signOut as jest.Mock).mockImplementation(signOutMock);

    const { getByText } = renderWithProvider();

    const logoutButton = getByText('Logout');
    act(() => {
      logoutButton.click();
    });

    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalled();
    });
  });

  test('logout handles sign-out errors', async () => {
    const signOutMock = jest.fn().mockRejectedValue(new Error('Sign-out failed'));
    (auth.signOut as jest.Mock).mockImplementation(signOutMock);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText } = renderWithProvider();

    const logoutButton = getByText('Logout');
    act(() => {
      logoutButton.click();
    });

    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error signing out:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
