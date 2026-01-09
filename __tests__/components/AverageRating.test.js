import React from 'react';
import { render } from '@testing-library/react-native';
import AverageRating from '../../components/AverageRating';

describe('AverageRating', () => {
  it('renders correctly with rating and count', () => {
    const { getByText } = render(<AverageRating rating={4.5} count={10} />);
    
    expect(getByText('4.5 (10 reviews)')).toBeTruthy();
  });

  it('renders correctly with integer rating', () => {
    const { getByText } = render(<AverageRating rating={5} count={2} />);
    
    expect(getByText('5.0 (2 reviews)')).toBeTruthy();
  });
});
