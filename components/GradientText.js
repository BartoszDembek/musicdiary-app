import React from 'react';
import { Text } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

const GradientText = ({ style, ...props }) => {
  return (
    <MaskedView maskElement={<Text {...props} style={style} />} style={{ alignItems: 'center', justifyContent: 'center' }}>
      <LinearGradient
        colors={['#E0AAFF', '#C77DFF', '#9D4EDD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[{ alignItems: 'center', justifyContent: 'center' }, style]}
      >
        <Text {...props} style={[style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
