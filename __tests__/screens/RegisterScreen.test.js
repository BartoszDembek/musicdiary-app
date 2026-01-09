import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RegisterScreen from '../../screens/RegisterScreen';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

// Mock dependencies
jest.mock('../../services/authService');
jest.mock('../../context/AuthContext');
jest.mock('../../components/ImagePicker', () => ({
  __esModule: true,
  default: () => ({
    showImagePicker: jest.fn(),
  }),
}));
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
}));
jest.mock('../../components/Auth/Header', () => {
  const { View, Text } = require('react-native');
  return () => <View><Text>Header</Text></View>;
});

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('RegisterScreen', () => {
  const mockSignIn = jest.fn();
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    useAuth.mockReturnValue({
      signIn: mockSignIn,
    });
    jest.clearAllMocks();
  });

  it('renders step 1 correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <RegisterScreen navigation={mockNavigation} />
      </NavigationContainer>
    );
    
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Minimum 8 characters')).toBeTruthy();
    expect(getByPlaceholderText('Repeat your password')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
  });

  it('validates step 1', () => {
    const { getByText } = render(
      <NavigationContainer>
        <RegisterScreen navigation={mockNavigation} />
      </NavigationContainer>
    );
    
    fireEvent.press(getByText('Next'));
    
    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Email field is required",
      expect.any(Array)
    );
  });

  it('navigates to step 2 on valid step 1', () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <RegisterScreen navigation={mockNavigation} />
      </NavigationContainer>
    );
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Minimum 8 characters'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Repeat your password'), 'password123');
    
    fireEvent.press(getByText('Next'));
    
    expect(getByPlaceholderText('Choose a username')).toBeTruthy();
  });
});
