import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../graphql/login";
import SnackbarComponent from "../UI/Snackbar/SnackbarComponent";
import ThreeDButton from "./ThreeDButton";
import { HelperText } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../config/AuthContext";

const Login = () => {
  const { signIn } = useAuth();
  const [identifier, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigation = useNavigation();
  const [loginMutation] = useMutation(LOGIN);

  const handleToggleSnackbar = () => setSnackbarVisible(!snackbarVisible);

  const handleLogin = async () => {
    try {
      const { data } = await loginMutation({
        variables: { identifier, password },
      });
      setSnackbarMessage("Login Successful");
      console.log("Login Response:", data);
      signIn({ data });
      // Implement logic based on login response

      // Navigate to Dashboard on successful login
      navigation.navigate("Dashboard");

      // Show success Snackbar
      handleToggleSnackbar();
    } catch (error) {
      console.error("Login Error:", error);

      // Handle login error
      setSnackbarMessage("Please Check Email/Password !");

      // Show error Snackbar
      handleToggleSnackbar();
    }
  };

  const hasErrors = () => {
    return !identifier.includes("@");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={identifier}
        onChangeText={(text) => setUsername(text)}
      />
      <HelperText type="error" visible={hasErrors()}>
        Please enter a valid email address!
      </HelperText>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <ThreeDButton onPress={handleLogin} title="Login" />

      <SnackbarComponent
        visible={snackbarVisible}
        onDismiss={handleToggleSnackbar}
        message={snackbarMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 200,
  },
});

export default Login;
