import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import StatsDetailScreen from '../../screens/StatsDetailScreen';
import { userService } from '../../services/userService';
import { spotifyService } from '../../services/spotifyService';

// Mock dependencies
jest.mock('../../services/userService');
jest.mock('../../services/spotifyService');
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
}));

// Mock useRoute
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {
        type: 'followers',
        title: 'Followers',
        data: [{ id: '123', user_id: '456', createdAt: '2023-01-01' }],
      },
    }),
  };
});

describe('StatsDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and loads follower info', async () => {
    const mockUserInfo = {
      id: '456',
      username: 'FollowerUser',
      avatar: 'avatar-url',
    };

    userService.getFollowerInfo.mockResolvedValue(mockUserInfo);

    const { getByText } = render(<StatsDetailScreen />);

    expect(getByText('Followers')).toBeTruthy();

    await waitFor(() => {
      expect(getByText('FollowerUser')).toBeTruthy();
      expect(getByText('Following since January 1, 2023')).toBeTruthy();
    });
  });
});
