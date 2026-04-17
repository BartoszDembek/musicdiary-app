import React from 'react';
import Svg, { Circle } from 'react-native-svg';

const Disc3 = ({ size = 24, color = '#000', strokeWidth = 1.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="12" cy="12" r="1.5" fill={color} />
  </Svg>
);

export default Disc3;
