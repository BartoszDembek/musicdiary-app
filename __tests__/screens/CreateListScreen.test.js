import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import CreateListScreen from '../../screens/CreateListScreen';
import { listService } from '../../services/listService';
import { useAuth } from '../../context/AuthContext';

// Mock dependencies
jest.mock('../../services/listService');
jest.mock('../../context/AuthContext');
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('CreateListScreen', () => {
  const mockUser = { id: 1 };
  const mockNavigation = { goBack: jest.fn() };

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: mockUser,
    });
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<CreateListScreen navigation={mockNavigation} />);
    
    expect(getByText('New List')).toBeTruthy();
    expect(getByPlaceholderText('Ex. Favorite Albums 2024')).toBeTruthy();
    expect(getByPlaceholderText('Short description...')).toBeTruthy();
  });

  it('creates a list on valid input', async () => {
    listService.createList.mockResolvedValue({});

    const { getByText, getByPlaceholderText } = render(<CreateListScreen navigation={mockNavigation} />);
    
    fireEvent.changeText(getByPlaceholderText('Ex. Favorite Albums 2024'), 'My New List');
    fireEvent.changeText(getByPlaceholderText('Short description...'), 'Description');
    
    fireEvent.press(getByText('Create List'));
    
    await waitFor(() => {
      expect(listService.createList).toHaveBeenCalledWith(1, 'My New List', 'Description', false);
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success',
        'List created successfully',
        expect.any(Array)
      );
    });
  });
});
