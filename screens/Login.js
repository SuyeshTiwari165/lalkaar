import React, { useState, useContext } from "react";
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
} from "../components/Theme/Styles";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/mutations/login";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import { View, ActivityIndicator } from "react-native";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import { CredentialsContext } from "../config/CredentialsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as GoogleSignIn from "expo-google-sign-in";

const { brand, darkLight, primary } = Colors;
const Login = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState();
  const [googleSubmitting, setGoogleSubmitting] = useState(true);

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const [loginMutation] = useMutation(LOGIN);

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  };

  const handleLogin = async (credentials, setSubmitting) => {
    console.log("credentials", credentials.identifier);
    handleMessage(null);
    try {
      const { data, errors } = await loginMutation({
        variables: {
          identifier: credentials.identifier,
          password: credentials.password,
        },
      });

      if (errors) {
        console.error("GraphQL Errors:", errors);
        handleMessage(
          "An error occurred during login. Please try again.",
          "FAILED"
        );
      } else {
        console.log("GraphQL Data:", data);
        persistLogin({ ...data }, message, "success");
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
  };

  const handleGoogleSignin = () => {
    setGoogleSubmitting(true);
    const config = {
      iosClientId: ``,
      androidClientId: ``,
      scopes: ["profile", "email"],
    };

    Google.logInAsync(config)
      .then((result) => {
        const { type, user } = result;
        if (type == "success") {
          const { email, name, photoUrl } = user;
          handleMessage("Google signin successfully", "SUCCESS");
          persistLogin({ email, name, photoUrl }, message, "success");
        } else {
          handleMessage("Google Signin was Cancelled");
        }
        setGoogleSubmitting(false);
      })
      .catch((error) => {
        console.log(error);
        handleMessage("An error occurred. Check you network and try again");
        setGoogleSubmitting(false);
      });
  };

  const persistLogin = (credentials, message, status) => {
    AsyncStorage.setItem("lalkaarCredentials", JSON.stringify(credentials))
      .then(() => {
        handleMessage(message, status);
        setStoredCredentials(credentials);
      })
      .catch((error) => {
        console.log(error);
        handleMessage("An Error Occurred. Please try again Later");
      });
  };

  // const initAsync = async () => {
  //   try {
  //     await GoogleSignIn.initAsync({
  //       clientId: "",
  //     });
  //   } catch {}
  // };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <PageLogo resizeMode="cover" source={require("../assets/icon.png")} />
          <PageTitle>Lalkaar</PageTitle>
          <SubTitle>Account Login</SubTitle>
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
                {console.log("setSubmitting", isSubmitting)}
                <MytextInput
                  label="Email Address"
                  icon="mail"
                  placeholder="johndoe@mail.com"
                  onChangeText={handleChange("identifier")}
                  onBlur={handleBlur("identifier")}
                  value={values.identifier}
                  keyboardType="email-address"
                />
                <MytextInput
                  label="Password"
                  icon="lock"
                  placeholder="* * * * * * * * * "
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox type={messageType}>{message}</MsgBox>
                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Login</ButtonText>
                  </StyledButton>
                )}
                {isSubmitting && (
                  <StyledButton disabled={true}>
                    <ActivityIndicator size="Large" color={primary} />
                  </StyledButton>
                )}
                <Line />
                <StyledButton google={true} onPress={handleSubmit}>
                  <Fontisto name="google" color={primary} size={25} />
                  <ButtonText google={true}> Sign in with Google</ButtonText>
                </StyledButton>
                <ExtraView>
                  <ExtraText>Don't have an Account already?</ExtraText>
                  <TextLink onPress={() => navigation.navigate("Signup")}>
                    <TextLinkContent>Signup</TextLinkContent>
                  </TextLink>
                </ExtraView>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
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
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
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

export default Login;
