import React, { useState, useContext } from "react";
import {
  StyledContainer,
  InnerContainer,
  WelcomeContainer,
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
  WelcomeImage,
  Avatar,
} from "../components/Theme/Styles";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/mutations/login";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import { View } from "react-native";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";

const { brand, darkLight, primary } = Colors;
const Welcome = ({ navigation }) => {
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
          <SubTitle welcome={true}>Suyesh</SubTitle>
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
        <Octicons name={icon} size={30} />
      </LeftIcon>
      <StyledInputlable>{label}</StyledInputlable>
      <StyledTextInput {...props} />
      {isPassword && (
        <RightIcon>
          <Ionicons
            name={hidePassword ? "eye-off" : "eye"}
            size={30}
            color={darkLight}
          />
        </RightIcon>
      )}
    </View>
  );
};

export default Welcome;
