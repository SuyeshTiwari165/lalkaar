import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
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
import { StatusBar } from "expo-status-bar";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import * as Location from "expo-location";
import DataTable from "./DataTable";

const { brand, darkLight, primary } = Colors;
const AcceptRequest = ({ navigation }) => {
  const [showProfileOptions, setShowProfileOptions] = useState(false); // Added state to control the display of profile options
  const [location, setLocation] = useState(null);

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

  const handleProfilePress = () => {
    setShowProfileOptions(!showProfileOptions);
  };

  const ClearLogin = () => {
    AsyncStorage.removeItem("lalkaarCredentials")
      .then(() => {
        setStoredCredentials("");
      })
      .catch((error) => console.log(error));
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
      <StatusBar style="light" />
      <InnerContainer>
        <View style={styles.header}>
          <PageTitle welcome={true}>Lalkaar</PageTitle>

          <RightIcon onPress={handleProfilePress}>
            <Ionicons name="person-circle-outline" size={30} color={brand} />
          </RightIcon>

          {renderProfileOptions()}
        </View>

        <View>
          <View style={styles.centeredView}>
            <Text>Accept SOS Request</Text>
            <StyledButton>
              <ButtonText>Comming</ButtonText>
            </StyledButton>
            {location !== null && location?.coords !== null ? (
              <Text>
                Location: {JSON.stringify(location?.coords?.latitude)},
                {JSON.stringify(location?.coords?.longitude)}
              </Text>
            ) : null}
            {/* <SOSButton onPress={handleSOSPress}>
              <ButtonText>SOS</ButtonText>
            </SOSButton> */}
            <DataTable />
          </View>
        </View>
      </InnerContainer>
    </StyledContainer>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "yourColorHere", // Set your desired background color
  },
});

export default AcceptRequest;
