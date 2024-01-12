import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import TextField from "@mui/material/TextField";
import { useAuth } from "../../config/AuthContext";

const Registration = () => {
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  const handleRegistration = () => {
    // Implement registration logic here
    console.log("User registered:", username);
  };

  return (
    <View>
      <TextField
        placeholder="First Name"
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
        secureTextEntry
      />
      <TextField
        placeholder="Last Name"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
        secureTextEntry
      />
      <TextField
        placeholder="Mobile"
        value={mobile}
        onChangeText={(text) => setMobile(text)}
        secureTextEntry
      />
      <TextField
        placeholder="Address"
        value={address}
        onChangeText={(text) => setAddress(text)}
        multiline={true}
        numberOfLines={4} // Adjust the number of lines as needed
        style={{ height: 100, textAlignVertical: "top" }} // Set the height and text alignment
      />
      <TextField
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextField
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />

      <Button title="Register" onPress={handleRegistration} />
    </View>
  );
};

export default Registration;
