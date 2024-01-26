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
import { USER_DATA } from "../graphql/queries/Users";
import { Octicons, Ionicons } from "@expo/vector-icons";
import { CredentialsContext } from "../context/CredentialsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@apollo/client";
import Loader from "../components/Loader";
import { NetworkStatus } from "@apollo/client";

const { brand, darkLight, primary } = Colors;
const ProfilePage = ({ navigation, props }) => {
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setmobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [AvatarImage, setAvatarImage] = useState("");

  useEffect(() => {
    console.log("data", data);
    if (data) {
      console.log("user data", data);
      setFullName(data.usersPermissionsUser.data.attributes.firstName);
      setmobileNumber(data.usersPermissionsUser.data.attributes.mobileNumber);
      setEmail(data.usersPermissionsUser.data.attributes.email);
      setAvatarImage(
        `http://192.168.0.106:1337${data.usersPermissionsUser.data.attributes.profilePicture.data.attributes.url}`
      );
    }
  }, [loading]);

  const { loading, error, data, refetch, networkStatus } = useQuery(
    USER_DATA,

    {
      variables: { id: 1 },

      notifyOnNetworkStatusChange: true,
    }
  );

  if (networkStatus === NetworkStatus.refetch) return "Refetching!";

  if (loading) return null;

  if (error) return `Error! ${error}`;
  console.log("AvatarImage", AvatarImage);

  return (
    <>
      <StatusBar style="light" />
      <InnerContainer>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {/* <WelcomeImage
              resizeMode="cover"
              source={require("../assets/welcome2.jpg")}
            /> */}
            <WelcomeContainer>
              <PageTitle welcome={true}>My profile</PageTitle>
              <SubTitle welcome={true}>
                Name:-{data.usersPermissionsUser.data.attributes.firstName}
              </SubTitle>
              <SubTitle welcome={true}>
                Email:-{data.usersPermissionsUser.data.attributes.email}
              </SubTitle>
              <SubTitle welcome={true}>
                Mobile:-{data.usersPermissionsUser.data.attributes.mobileNumber}
              </SubTitle>
              <StyledFormArea>
                <Avatar
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    resizeMode: "cover",
                  }}
                  source={{
                    uri: AvatarImage,
                  }}
                />
                <Line />
                <StyledButton onPress={() => navigation.navigate("Dashboard")}>
                  <ButtonText>Dashboard</ButtonText>
                </StyledButton>
              </StyledFormArea>
            </WelcomeContainer>
          </>
        )}
      </InnerContainer>
    </>
  );
};

export default ProfilePage;
