import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import UserProfileScreen from '../../screens/UserProfileScreen';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

// Mock dependencies
jest.mock('../../services/userService');
jest.mock('../../services/followService');
jest.mock('../../context/AuthContext');
jest.mock('../../components/RecentActivity', () => {
  const { View, Text } = require('react-native');
  return () => <View><Text>Recent Activity</Text></View>;
});
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
}));

// Mock useFocusEffect
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  const React = require('react');
  return {
    ...actualNav,
    useFocusEffect: (callback) => React.useEffect(callback, []),
    useNavigation: () => ({
      setOptions: jest.fn(),
      navigate: jest.fn(),
    }),
    useRoute: () => ({ params: { userId: '123' } }),
  };
});

describe('UserProfileScreen', () => {
  const mockUser = { id: 1 };
  const mockCurrentUserProfile = { follows: [{ follow: [] }] };

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: mockUser,
      userProfile: mockCurrentUserProfile,
      updateUserProfile: jest.fn(),
    });
    jest.clearAllMocks();
  });

  it('renders correctly and loads user profile', async () => {
    const mockProfileData = [{
      id: '123',
      username: 'OtherUser',
      created_at: '2023-01-01',
      follows: [{ follow: [] }],
      reviews: [],
      favorites: [{ favorite: [] }],
      followers: [],
    }];

    userService.getUserProfile.mockResolvedValue(mockProfileData);

    const { getByText } = render(<UserProfileScreen />);

    await waitFor(() => {
      expect(getByText('OtherUser')).toBeTruthy();
      expect(getByText('Joined: January 2023')).toBeTruthy();
      expect(getByText('Recent Activity')).toBeTruthy();
    });
  });
});
