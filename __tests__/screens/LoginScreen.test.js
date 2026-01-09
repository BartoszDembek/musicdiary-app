import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../../screens/LoginScreen';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

// Mock dependencies
jest.mock('../../services/authService');
jest.mock('../../context/AuthContext');
jest.mock('../../components/Auth/Header', () => {
  const { View, Text } = require('react-native');
  return () => <View><Text>Header</Text></View>;
});

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('LoginScreen', () => {
  const mockSignIn = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      signIn: mockSignIn,
    });
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <LoginScreen />
      </NavigationContainer>
    );
    
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('shows error when fields are empty', () => {
    const { getByText } = render(
      <NavigationContainer>
        <LoginScreen />
      </NavigationContainer>
    );
    const loginButton = getByText('Sign In');
    
    fireEvent.press(loginButton);
    
    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Email field is required",
      expect.any(Array)
    );
  });

  it('calls login service and signIn on valid input', async () => {
    const mockUser = { id: 1, name: 'Test User' };
    const mockToken = 'fake-token';
    
    authService.login.mockResolvedValue({
      user: mockUser,
      token: mockToken,
    });

    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <LoginScreen />
      </NavigationContainer>
    );
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    
    fireEvent.press(getByText('Sign In'));
    
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockSignIn).toHaveBeenCalledWith(mockToken, mockUser);
    });
  });
});
