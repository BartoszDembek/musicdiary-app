import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ListDetailScreen from '../../screens/ListDetailScreen';
import { listService } from '../../services/listService';

// Mock dependencies
jest.mock('../../services/listService');
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
}));
jest.mock('react-native-draggable-flatlist', () => {
  const { View } = require('react-native');
  const MockDraggableFlatList = ({ data, renderItem }) => (
    <View>
      {data.map((item, index) => (
        <View key={item.id || index}>
          {renderItem({ item, index, isActive: false, drag: jest.fn() })}
        </View>
      ))}
    </View>
  );
  return {
    __esModule: true,
    default: MockDraggableFlatList,
    ScaleDecorator: ({ children }) => children,
  };
});
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }) => children,
}));

describe('ListDetailScreen', () => {
  const mockRoute = { params: { listId: '123', title: 'My List' } };
  const mockNavigation = { setOptions: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and loads list details', async () => {
    const mockList = {
      id: '123',
      title: 'My List',
      description: 'My Description',
      isPublic: true,
      list_items: [
        { id: 1, item_name: 'Item 1', position: 0, type: 'album' },
        { id: 2, item_name: 'Item 2', position: 1, type: 'artist' },
      ],
    };

    listService.getListDetails.mockResolvedValue(mockList);

    const { getByText } = render(<ListDetailScreen route={mockRoute} navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('My Description')).toBeTruthy();
      expect(getByText('Item 1')).toBeTruthy();
      expect(getByText('Item 2')).toBeTruthy();
    });
  });
});
