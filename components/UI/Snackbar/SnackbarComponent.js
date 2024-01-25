import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";

const SnackbarComponent = ({ visible, onDismiss, message }) => {
  return (
    <View style={styles.container}>
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        duration={3000} // Set your desired duration
      >
        {message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0, // Adjust as needed
    left: 0,
    right: 0,
  },
});

export default SnackbarComponent;
