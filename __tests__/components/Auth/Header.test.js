import React from 'react';
import { render } from '@testing-library/react-native';
import Header from '../../../components/Auth/Header';

describe('Header', () => {
  it('renders correctly with subtitle', () => {
    const { getByText } = render(<Header subtitle="Test Subtitle" />);
    
    expect(getByText('MusicDiary')).toBeTruthy();
    expect(getByText('Test Subtitle')).toBeTruthy();
  });
});
