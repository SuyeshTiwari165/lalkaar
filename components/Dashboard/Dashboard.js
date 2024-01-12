import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  // PermissionsAndroid,
} from "react-native"; // Import Platform from react-native
import * as Location from "expo-location";
import { Modal, Portal, Button, Provider, TextInput } from "react-native-paper";
import SOSButton from "../SOSButton/SOSButton";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../../config/AuthContext";

const Dashboard = () => {
  const { signOut } = useAuth();
  const [visible, setVisible] = useState(false);
  const [severity, setSeverity] = useState("");
  const [peopleCount, setPeopleCount] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        console.error("Error getting location:", error);
        setErrorMsg("Error getting location");
      }
    })();
  }, []);

  const showModal = async () => {
    setVisible(true);
    if (Platform.OS === "android") {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        console.error("Error getting location:", error);
        setErrorMsg("Error getting location");
      }
    }
  };

  const hideModal = () => setVisible(false);

  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: "50%",
  };

  const severityItems = ["Low", "Medium", "High"];

  const handleSOSPress = () => {
    showModal();
  };

  const handleSeverityChange = (selectedSeverity) => {
    setSeverity(selectedSeverity);
  };

  const handlePeopleCountChange = (text) => {
    setPeopleCount(text);
  };

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const handleCustomAction = () => {
    console.log("Severity:", severity);
    console.log("People Count:", peopleCount);
    console.log("Input Value:", inputValue);
    // Implement your logic with the selected values
    hideModal();
  };

  return (
    <View style={styles.container}>
      <SOSButton onPress={handleSOSPress}>Show SOS Modal</SOSButton>
      <Text>Location Example</Text>
      {errorMsg ? <Text>{errorMsg}</Text> : null}
      {location ? <Text>Location: {JSON.stringify(location)}</Text> : null}
      <Provider>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}
          >
            <Text style={styles.modalText}>Provide details about the SOS:</Text>

            <Picker
              selectedValue={severity}
              style={styles.dropdownContainer}
              onValueChange={(itemValue) => handleSeverityChange(itemValue)}
            >
              {severityItems.map((item, index) => (
                <Picker.Item label={item} value={item} key={index} />
              ))}
            </Picker>

            <TextInput
              label="Number of people present"
              value={peopleCount}
              onChangeText={handlePeopleCountChange}
              style={styles.input}
            />

            <TextInput
              label="Additional Information"
              value={inputValue}
              onChangeText={handleInputChange}
              style={styles.input}
            />

            {/* Add your Image/Video upload component here */}

            <Button onPress={handleCustomAction}>Submit SOS</Button>
            <Button onPress={hideModal}>Cancel</Button>
          </Modal>
          <Button onPress={signOut}>Logout</Button>
        </Portal>
      </Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  modalText: {
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    marginBottom: 10,
  },
  dropdownContainer: {
    height: 40,
    width: 200,
    marginBottom: 10,
  },
});

export default Dashboard;
