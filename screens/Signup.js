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
import { REGISTRATION } from "../graphql/mutations/registration";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import { View, ActivityIndicator } from "react-native";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
} from "@apollo/client";
import { CredentialsContext } from "../config/CredentialsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { brand, darkLight, primary } = Colors;
const Signup = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState();

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const [registrationMutation] = useMutation(REGISTRATION);

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  };

  const handleSignup = async (credentials, setSubmitting) => {
    handleMessage(null);
    try {
      const { data, errors } = await registrationMutation({
        variables: {
          username: credentials.email.split("@", 2)[0],
          email: credentials.email,
          password: credentials.password,
          role: 1,
          firstName: credentials.fullName,
          lastName: credentials.fullName,
          mobileNumber: parseInt(credentials.mobile),
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

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <PageTitle>Lalkaar</PageTitle>
          <SubTitle>Account Signup</SubTitle>
          <Formik
            initialValues={{
              email: "",
              password: "",
              fullName: "",
              mobile: "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              console.table("values", values);
              if (
                values.email == "" ||
                values.password == "" ||
                values.fullName == "" ||
                values.mobile == ""
              ) {
                handleMessage("Please fill all the fields");
                setSubmitting(false);
              } else {
                handleSignup(values, setSubmitting);
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
                <MytextInput
                  label="Full Name"
                  icon="person"
                  placeholder="Anjaneya"
                  onChangeText={handleChange("fullName")}
                  onBlur={handleBlur("fullName")}
                  value={values.fullName}
                  keyboardType="full-name"
                />
                <MytextInput
                  label="Email Address"
                  icon="mail"
                  placeholder="johndoe@mail.com"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                />
                <MytextInput
                  label="Mobile"
                  icon="number"
                  placeholder="+91 4511223508"
                  onChangeText={handleChange("mobile")}
                  onBlur={handleBlur("mobile")}
                  value={values.mobile}
                  keyboardType="number-pad"
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
                    <ButtonText>Signup</ButtonText>
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
                  <ExtraText>Already have an Account ?</ExtraText>
                  <TextLink onPress={() => navigation.navigate("Login")}>
                    <TextLinkContent>Login</TextLinkContent>
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

export default Signup;
