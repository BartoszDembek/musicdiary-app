import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ListsScreen from '../../screens/ListsScreen';
import { listService } from '../../services/listService';
import { useAuth } from '../../context/AuthContext';

// Mock dependencies
jest.mock('../../services/listService');
jest.mock('../../context/AuthContext');
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
      navigate: jest.fn(),
    }),
  };
});

describe('ListsScreen', () => {
  const mockUser = { id: 1 };

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: mockUser,
    });
    jest.clearAllMocks();
  });

  it('renders correctly and loads user lists', async () => {
    const mockLists = [
      { id: 1, title: 'My List 1', isPublic: true, items: [] },
      { id: 2, title: 'My List 2', isPublic: false, items: [] },
    ];

    listService.getUserLists.mockResolvedValue(mockLists);

    const { getByText } = render(<ListsScreen />);

    await waitFor(() => {
      expect(getByText('Lists')).toBeTruthy();
      expect(getByText('My List 1')).toBeTruthy();
      expect(getByText('My List 2')).toBeTruthy();
    });
  });
});
