import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import MainScreen from '../../screens/MainScreen';
import { spotifyService } from '../../services/spotifyService';

// Mock dependencies
jest.mock('../../services/spotifyService');
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('../../components/SearchModal', () => {
  const { View, Text } = require('react-native');
  return ({ visible }) => visible ? <View><Text>Search Modal</Text></View> : null;
});
jest.mock('../../components/RenderAlbumCard', () => {
  const { View, Text } = require('react-native');
  return ({ album }) => <View><Text>{album.name}</Text></View>;
});

describe('MainScreen', () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and loads albums', async () => {
    const mockAlbums = {
      albums: {
        items: [
          {
            id: '1',
            name: 'Album 1',
            images: [{ url: 'http://example.com/1.jpg' }],
            artists: [{ name: 'Artist 1' }]
          },
          {
            id: '2',
            name: 'Album 2',
            images: [{ url: 'http://example.com/2.jpg' }],
            artists: [{ name: 'Artist 2' }]
          }
        ]
      }
    };
    
    let resolveAlbums;
    const albumsPromise = new Promise(resolve => { resolveAlbums = resolve; });
    spotifyService.loadAlbums.mockReturnValue(albumsPromise);

    const { getByText } = render(<MainScreen navigation={mockNavigation} />);

    expect(getByText('MusicDiary')).toBeTruthy();
    expect(getByText('New Releases')).toBeTruthy();

    await act(async () => {
      resolveAlbums(mockAlbums);
    });

    await waitFor(() => {
      expect(getByText('Album 1')).toBeTruthy();
      expect(getByText('Album 2')).toBeTruthy();
    });
  });

  it('opens search modal on search button press', async () => {
    spotifyService.loadAlbums.mockResolvedValue({ 
      albums: { 
        items: [{ 
          id: '1', 
          name: 'Test Album', 
          images: [{ url: 'http://example.com/1.jpg' }], 
          artists: [{ name: 'Artist 1' }] 
        }] 
      } 
    });
    const { getByText, getByTestId } = render(<MainScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(getByText('Test Album')).toBeTruthy();
    });

    fireEvent.press(getByTestId('search-button'));
    
    expect(getByText('Search Modal')).toBeTruthy();
  });
});
