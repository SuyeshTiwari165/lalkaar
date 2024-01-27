import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const Loader = ({ visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text>Helooo</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100% !important',
    height: '100% !important',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    opacity: 0.8,
  },
});

export default Loader;
