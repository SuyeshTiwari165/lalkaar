import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  // PermissionsAndroid,
} from "react-native"; // Import Platform from react-native
import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputlable,
  StyledTextInput,
  RightIcon,
  StyledButton,
  ButtonText,
  Colors,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
  SOSButton,
} from "../components/Theme/Styles";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import { useMutation } from "@apollo/client";
import * as Location from "expo-location";
import { Modal, Portal, Button, Provider, TextInput } from "react-native-paper";
// import SOSButton from "../components/SOSButton/SOSButton";
import { Picker } from "@react-native-picker/picker";
import { CREATE_SOS } from "../graphql/mutations/sos";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import { CredentialsContext } from "../config/CredentialsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { brand, darkLight, primary } = Colors;

const Dashboard = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [severity, setSeverity] = useState("");
  const [peopleCount, setPeopleCount] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const ClearLogin = () => {
    AsyncStorage.removeItem("lalkaarCredentials")
      .then(() => {
        setStoredCredentials("");
      })
      .catch((error) => console.log(error));
  };

  const [createSosRequest] = useMutation(CREATE_SOS);

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

  const signOut = () => {};

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
    <StyledContainer>
      <StatusBar style="light" />
      <InnerContainer>
        {/* <PageLogo resizeMode="cover" source={require("../assets/icon.png")} />
        <PageTitle>Lalkaar</PageTitle>
        <SubTitle>Account Login</SubTitle> */}
        <View>
          <View style={styles.centeredView}>
            <SOSButton onPress={handleSOSPress}>
              <ButtonText>SOS</ButtonText>
            </SOSButton>
          </View>
          <Provider>
            <Portal>
              <Modal
                visible={visible}
                onDismiss={hideModal}
                contentContainerStyle={containerStyle}
              >
                <Text style={styles.modalText}>
                  Provide details about the SOS:
                </Text>
                <Formik
                  initialValues={{ identifier: "", password: "" }}
                  onSubmit={(values, { setSubmitting }) => {
                    if (values.identifier == "" || values.password == "") {
                      handleMessage("Please fill all the fields");
                      setSubmitting(false);
                    } else {
                      handleLogin(values, setSubmitting);
                    }
                  }}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    isSubmitting,
                  }) => (
                    <StyledFormArea>
                      <Picker
                        selectedValue={severity}
                        style={styles.dropdownContainer}
                        onValueChange={(itemValue) =>
                          handleSeverityChange(itemValue)
                        }
                      >
                        {severityItems.map((item, index) => (
                          <Picker.Item label={item} value={item} key={index} />
                        ))}
                      </Picker>
                      <Text>Location Example</Text>
                      {errorMsg ? <Text>{errorMsg}</Text> : null}
                      {location ? (
                        <Text>Location: {JSON.stringify(location)}</Text>
                      ) : null}
                      <MytextInput
                        label="Number of people present"
                        icon="person"
                        placeholder=""
                        onChangeText={handleChange("peopleCount")}
                        onBlur={handleBlur("peopleCount")}
                        value={values.peopleCount}
                        keyboardType="email-address"
                      />

                      <MytextInput
                        label="Additional Information"
                        icon="mail"
                        placeholder=""
                        onChangeText={handleChange("inputValue")}
                        onBlur={handleBlur("inputValue")}
                        value={values.inputValue}
                        keyboardType="email-address"
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
                    </StyledFormArea>
                  )}
                </Formik>
              </Modal>
              <Button onPress={ClearLogin}>Logout</Button>
            </Portal>
          </Provider>
        </View>
      </InnerContainer>
    </StyledContainer>
  );
};

const MytextInput = ({
  label,
  icon,
  isPassword,
  hidePassword,
  setHidePassword,
  ...props
}) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputlable>{label}</StyledInputlable>
      <StyledTextInput {...props} />
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
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
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
