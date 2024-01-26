import React, { useState, useContext, useEffect } from "react";
import {
  InnerContainer,
  WelcomeContainer,
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
  Line,
  WelcomeImage,
  Avatar,
} from "../components/Theme/Styles";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Octicons, Ionicons } from "@expo/vector-icons";
import { CredentialsContext } from "../context/CredentialsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { brand, darkLight, primary } = Colors;
const Welcome = ({ navigation, props }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    checkLoginCredentials();
  }, []);

  const checkLoginCredentials = () => {
    AsyncStorage.getItem("lalkaarCredentials")
      .then((response) => JSON.parse(response))
      .then((data) => {
        if (data.login) {
          setUserName(data.login.user.username);
        } else {
          setUserName(data.createUsersPermissionsUser.data.attributes.username);
          console.log(
            "DATA ---",
            data.createUsersPermissionsUser.data.attributes.username
          );
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <StatusBar style="light" />
      <InnerContainer>
        <WelcomeImage
          resizeMode="cover"
          source={require("../assets/welcome2.jpg")}
        />
        <WelcomeContainer>
          <PageTitle welcome={true}>Welcome Buddy!</PageTitle>
          <SubTitle welcome={true}>{userName}</SubTitle>
          <StyledFormArea>
            <Avatar resizeMode="cover" source={require("../assets/icon.png")} />
            <Line />
            <StyledButton onPress={() => navigation.navigate("Dashboard")}>
              <ButtonText>Emergency</ButtonText>
            </StyledButton>
          </StyledFormArea>
        </WelcomeContainer>
      </InnerContainer>
    </>
  );
};

export default Welcome;
