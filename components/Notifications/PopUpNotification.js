import React from 'react';
import { View, Text } from 'react-native';

const PopUpNotification = ({ message }) => {
  return (
    <View>
      <Text>{message}</Text>
    </View>
  );
};

export default PopUpNotification;
