import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RenderAlbumCard from '../../components/RenderAlbumCard';

const mockPush = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    push: mockPush,
  }),
}));

describe('RenderAlbumCard', () => {
  const mockAlbum = {
    id: '123',
    url: 'https://example.com/image.jpg',
  };

  it('renders correctly', () => {
    // Since we can't easily query by role without adding it, we'll check if it renders without crashing
    // and maybe check for the image if we could, but Image doesn't have text.
    // We can check if the component renders.
    const { toJSON } = render(<RenderAlbumCard album={mockAlbum} index={0} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('navigates to Album screen on press', () => {
    const { getByTestId } = render(<RenderAlbumCard album={mockAlbum} index={0} />);
    
    fireEvent.press(getByTestId('album-card-0'));
    
    expect(mockPush).toHaveBeenCalledWith('Album', { albumId: '123' });
  });
});
