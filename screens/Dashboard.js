import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Platform,
  ActivityIndicator,
} from "react-native"; // Import Platform from react-native
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputlable,
  StyledTextInput,
  RightIcon,
  StyledButton,
  ButtonText,
  Colors,
  SOSButton,
} from "../components/Theme/Styles";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { Modal, Portal, Button, Provider, TextInput } from "react-native-paper";
// import { Picker } from "@react-native-picker/picker";
import { CREATE_SOS } from "../graphql/mutations/sos";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import { CredentialsContext } from "../context/CredentialsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DataTable from "./DataTable";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { ACCEPT_SOS_REQUEST_DATA } from "../graphql/queries/AcceptedRequestData";
import { usePushNotificationContext } from "../context/PushNotificationContext";
import Loader from "../components/Loader";

const { brand, darkLight, primary } = Colors;

const Dashboard = ({ navigation }) => {
  const { expoPushToken } = usePushNotificationContext();
  const [message, setMessage] = useState("");
  const [keyboardStatus, setKeyboardStatus] = useState("");
  const [visible, setVisible] = useState(false);
  const [severity, setSeverity] = useState("");
  const [peopleCount, setPeopleCount] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [location, setLocation] = useState(null);
  const [liveLocation, setliveLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showProfileOptions, setShowProfileOptions] = useState(false); // Added state to control the display of profile options
  const [displayAccepteduserList, setDisplayAccepteduserList] = useState(false);
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

  const [getAcceptedUsers, { loading, error, getAcceptedUsersdata }] =
    useLazyQuery(ACCEPT_SOS_REQUEST_DATA);

  if (getAcceptedUsersdata) {
    console.log("RAM", getAcceptedUsersdata);
  }

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000, // Update every 1 second
            distanceInterval: 1, // Update every 1 meter
          },
          (newLocation) => {
            setliveLocation(newLocation.coords);
          }
        );
        setLocation(location);
      } catch (error) {
        console.error("Error getting location:", error);
        setErrorMsg("Error getting location");
      }
    })();
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus("Keyboard Shown");
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus("Keyboard Hidden");
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Location permission not granted");
        return;
      }

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every 1 second
          distanceInterval: 1, // Update every 1 meter
        },
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );
    })();
  }, []);
  
  const sendPushNotification = async (data) => {
    console.log("expoPushTokenexpoPushToken",expoPushToken)
    const message = {
      to: "ExponentPushToken[2_aeU0K1ZEKHasrPpk9pQ1]",
      sound: "default",
      title: "Need help",
      body: "Test body",
      data: { testData: data },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then((response) => {
        console.log("responsesss", response);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

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

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  };

  const handleSubmitSOS = async (values, setSubmitting) => {
    // Implement your logic with the selected values
    console.log("valuess", values);
    try {
      const { data, errors } = await createSosRequest({
        variables: {
          Description: values.AdditionalInformation,
          useId: 1,
          Severity: "Low",
          peopleCount: parseInt(values.peopleCount),
          geolocation: {
            address: "",
            geohash: "",
            coordinates: {
              lat: location?.latitude,
              lng: location?.longitude,
            },
          },
        },
      });

      if (errors) {
        console.error("GraphQL Errors:", errors);
        handleMessage(
          "An error occurred during login. Please try again.",
          "FAILED"
        );
      } else {
        console.log("GraphQL Data:", data.createSosRequest.data.id);
        setDisplayAccepteduserList(true);
        getAcceptedUsers({ variables: { id: data.createSosRequest.data.id } });
        sendPushNotification(data);
        // navigation.navigate("Welcome", { data });
      }

      setSubmitting(false);
    } catch (error) {
      console.error("Network Error:", error);
      setSubmitting(false);
      handleMessage(
        "An error occurred. Check your network and try again.",
        "FAILED"
      );
    }

    hideModal();
    setSubmitting(false);
  };

  const handleProfilePress = () => {
    setShowProfileOptions(!showProfileOptions);
  };

  const renderProfileOptions = () => {
    if (showProfileOptions) {
      return (
        <StyledContainer>
          <View>
            <StyledButton onPress={() => navigation.navigate("ProfilePage")}>
              <ButtonText>My Profile</ButtonText>
            </StyledButton>
            <StyledButton onPress={ClearLogin}>
              <ButtonText>Logout</ButtonText>
            </StyledButton>
          </View>
        </StyledContainer>
      );
    }
    return null;
  };

  return (
    <StyledContainer>
      <StatusBar backgroundColor="white" style="dark" />
      {location?.latitude == undefined || location?.longitude == undefined ? (
        <Loader />
      ) : (
        <></>
      )}
      <View style={styles.header}>
        <View>
          <PageTitle welcome={true}>Lalkaar</PageTitle>

          <RightIcon styles={styles.profileIcon} onPress={handleProfilePress}>
            <Ionicons name="person-circle-outline" size={30} color={brand} />
          </RightIcon>
          {renderProfileOptions()}
        </View>
      </View>
      <Text>keyboardStatus:{keyboardStatus}</Text>
      <InnerContainer>
        <View>
          <View style={styles.centeredView}>
            <SOSButton onPress={showModal}>
              <ButtonText>SOS</ButtonText>
            </SOSButton>

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
                    initialValues={{
                      peopleCount: "",
                      AdditionalInformation: "",
                      location: "",
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                      console.log("values", values);
                      handleSubmitSOS(values, setSubmitting);
                      setSubmitting(false);
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
                        {/* <Picker
                          selectedValue={severity}
                          style={styles.dropdownContainer}
                          onValueChange={(itemValue) =>
                            handleSeverityChange(itemValue)
                          }
                        >
                          {severityItems.map((item, index) => (
                            <Picker.Item
                              label={item}
                              value={item}
                              key={index}
                            />
                          ))}
                        </Picker> */}
                        <Text>Your Co-ordinates</Text>
                        {errorMsg ? <Text>{errorMsg}</Text> : null}
                        {location !== null && location?.coords !== null ? (
                          <Text>
                            Location: {JSON.stringify(location?.latitude)},
                            {JSON.stringify(location?.longitude)}
                          </Text>
                        ) : null}
                        <TextInput
                        // label="Number of people present"
                        // icon="person"
                        // placeholder="No. of people"
                        // onChangeText={handleChange("peopleCount")}
                        // onBlur={handleBlur("peopleCount")}
                        // value={values.peopleCount}
                        // keyboardType="number-pad"
                        />
                        <MytextInput
                          autoFocus
                          label="Number of people present"
                          icon="person"
                          placeholder="No. of people"
                          onChangeText={handleChange("peopleCount")}
                          onBlur={handleBlur("peopleCount")}
                          value={values.peopleCount}
                          keyboardType="number-pad"
                        />

                        <MytextInput
                          label="Additional Information"
                          icon="mail"
                          placeholder="Need help"
                          onChangeText={handleChange("AdditionalInformation")}
                          onBlur={handleBlur("AdditionalInformation")}
                          value={values.AdditionalInformation}
                          keyboardType="email-address"
                        />
                        {!isSubmitting && (
                          <StyledButton onPress={handleSubmit}>
                            <ButtonText>Submit SOS</ButtonText>
                          </StyledButton>
                        )}
                        {isSubmitting && (
                          <StyledButton disabled={true}>
                            <ActivityIndicator size="Large" color={primary} />
                          </StyledButton>
                        )}
                        <Button onPress={hideModal}>Cancel</Button>
                      </StyledFormArea>
                    )}
                  </Formik>
                </Modal>
                {/* <Line /> */}
              </Portal>
            </Provider>
            <View style={styles.dataTableContainer}>
              {/* Render your DataTable component */}
              {getAcceptedUsersdata && (
                <DataTable
                  usersData={getAcceptedUsersdata}
                  props={liveLocation}
                />
              )}
              {/* <DataTable
                usersData={getAcceptedUsersdata}
                props={liveLocation}
              /> */}
            </View>
            <Button onPress={() => navigation.navigate("AcceptRequest")}>
              Accept Request
            </Button>
          </View>
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
  inputContainer: {
    padding: 5,
  },
  inputStyle: {
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    borderRadius: 2,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  centeredView: {
    backgroundColor: "white",
    // justifyContent: "center",
    // alignItems: "center",
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
  header: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    color: "white",
    paddingVertical: 0,
    paddingHorizontal: 10,
    // backgroundColor: brand,
  },
  dataTableContainer: {
    // Style your DataTable container if needed
    marginTop: 20,
  },
  profileIcon: {
    alignItems: "right",
  },
});

export default Dashboard;
