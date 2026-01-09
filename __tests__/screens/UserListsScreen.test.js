import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import UserListsScreen from '../../screens/UserListsScreen';
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
    useRoute: () => ({ params: { userId: '123' } }),
  };
});

describe('UserListsScreen', () => {
  const mockUser = { id: 1 };

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: mockUser,
    });
    jest.clearAllMocks();
  });

  it('renders correctly and loads user lists', async () => {
    const mockLists = [
      { id: 1, title: 'User List 1', isPublic: true, list_items: [] },
    ];
    const mockRoute = { params: { userId: '123' } };

    listService.getUserLists.mockResolvedValue(mockLists);

    const { getByText } = render(<UserListsScreen route={mockRoute} />);

    await waitFor(() => {
      expect(getByText('My Lists')).toBeTruthy();
      expect(getByText('User List 1')).toBeTruthy();
    });
  });
});
