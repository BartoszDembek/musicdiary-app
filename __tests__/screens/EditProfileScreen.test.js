import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import EditProfileScreen from '../../screens/EditProfileScreen';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

// Mock dependencies
jest.mock('../../services/userService');
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
jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  EncodingType: { Base64: 'base64' },
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('EditProfileScreen', () => {
  const mockUpdateUserProfile = jest.fn();
  const mockNavigation = { goBack: jest.fn() };
  const mockUserProfile = {
    id: 1,
    username: 'OldUsername',
    email: 'old@example.com',
    avatar: 'old-avatar',
  };

  beforeEach(() => {
    useAuth.mockReturnValue({
      userProfile: mockUserProfile,
      updateUserProfile: mockUpdateUserProfile,
    });
    jest.clearAllMocks();
  });

  it('renders correctly with user data', () => {
    const { getByDisplayValue, getByText } = render(<EditProfileScreen navigation={mockNavigation} />);
    
    expect(getByDisplayValue('OldUsername')).toBeTruthy();
    expect(getByDisplayValue('old@example.com')).toBeTruthy();
    expect(getByText('Edit Profile')).toBeTruthy();
  });

  it('updates profile on save', async () => {
    userService.updateProfile.mockResolvedValue({});
    
    const { getByDisplayValue, getByText } = render(<EditProfileScreen navigation={mockNavigation} />);
    
    fireEvent.changeText(getByDisplayValue('OldUsername'), 'NewUsername');
    
    fireEvent.press(getByText('Save'));
    
    await waitFor(() => {
      expect(userService.updateProfile).toHaveBeenCalledWith(1, {
        username: 'NewUsername',
        email: 'old@example.com',
        avatar: 'old-avatar',
      });
      expect(mockUpdateUserProfile).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success',
        'Profile updated successfully',
        expect.any(Array)
      );
    });
  });
});
