import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const SOSButton = ({ onPress, children }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF0000", // Add your preferred background color
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF", // Add your preferred text color
    fontWeight: "bold",
  },
});

export default SOSButton;
