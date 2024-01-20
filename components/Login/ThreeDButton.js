import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

const ThreeDButton = ({ onPress, title }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Svg height="50" width="200">
        {/* Base rectangle */}
        <Rect x="0" y="0" width="200" height="50" fill="#3498db" />

        {/* Left 3D effect */}
        <Rect x="0" y="0" width="10" height="50" fill="#2980b9" />

        {/* Top 3D effect */}
        <Rect x="10" y="0" width="190" height="10" fill="#2980b9" />
      </Svg>
      <Text style={{ position: 'absolute', alignSelf: 'center', marginTop: 15, color: '#fff' }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ThreeDButton;
