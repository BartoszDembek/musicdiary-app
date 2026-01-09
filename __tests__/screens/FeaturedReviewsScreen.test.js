import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import FeaturedReviewsScreen from '../../screens/FeaturedReviewsScreen';
import { reviewService } from '../../services/reviewService';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

// Mock dependencies
jest.mock('../../services/reviewService');
jest.mock('../../services/userService');
jest.mock('../../context/AuthContext');
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
}));
jest.mock('../../components/CommentsSection', () => {
  const { View, Text } = require('react-native');
  return () => <View><Text>Comments Section</Text></View>;
});
jest.mock('../../components/VoteSection', () => {
  const { View, Text } = require('react-native');
  return () => <View><Text>Vote Section</Text></View>;
});

// Mock useFocusEffect
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  const React = require('react');
  return {
    ...actualNav,
    useFocusEffect: (callback) => React.useEffect(callback, []),
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

describe('FeaturedReviewsScreen', () => {
  const mockUser = { id: 1 };

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: mockUser,
    });
    jest.clearAllMocks();
  });

  it('renders correctly and loads featured reviews', async () => {
    const mockReviews = [
      {
        id: 1,
        text: 'Great album!',
        rating: 5,
        created_at: '2023-01-01',
        users: { _id: 2, username: 'Reviewer', avatar: 'avatar-url' },
        review_comments: [],
      },
    ];
    const mockProfileData = [{ follows: [{ follow: [] }] }];

    reviewService.getFeaturedReviews.mockResolvedValue(mockReviews);
    userService.getUserProfile.mockResolvedValue(mockProfileData);

    const { getByText } = render(<FeaturedReviewsScreen />);

    await waitFor(() => {
      expect(getByText('Featured Reviews')).toBeTruthy();
      expect(getByText('Great album!')).toBeTruthy();
      expect(getByText('Reviewer')).toBeTruthy();
    });
  });
});
