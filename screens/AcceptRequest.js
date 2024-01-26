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
import { ACCEPT_SOS_REQUEST } from "../graphql/mutations/AcceptSOSRequest";
import { useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../config/CredentialsContext";

const { brand, darkLight, primary } = Colors;
const AcceptRequest = ({ navigation }) => {
  const [showProfileOptions, setShowProfileOptions] = useState(false); // Added state to control the display of profile options
  const [location, setLocation] = useState(null);
  const [acceptSOS] = useMutation(ACCEPT_SOS_REQUEST);
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

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

  const handleAcceptButton = async () => {
    try {
      const { datas, errors } = await acceptSOS({
        variables: {
          live_location: {
            address: "",
            geohash: "",
            coordinates: {
              lat: location?.coords?.latitude,
              lng: location?.coords?.longitude,
            },
          },
          accepted: true,
          sos_request: 1,
          users_permissions_user: 1,
        },
      });
      if (datas) {
        console.log("datas", datas);
      }
      if (errors) {
        console.log("errorserrors", errors);
      }
    } catch (error) {
      console.log("error", error);
    }
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
            <StyledButton onPress={handleAcceptButton}>
              <ButtonText>Comming</ButtonText>
            </StyledButton>
            {location !== null && location?.coords !== null ? (
              <Text>
                Location: {JSON.stringify(location?.coords?.latitude)},
                {JSON.stringify(location?.coords?.longitude)}
              </Text>
            ) : null}
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
