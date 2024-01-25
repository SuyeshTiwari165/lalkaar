import React, { useState, useEffect, useRef } from "react";
import ApolloProviderWrapper from "./config/ApolloProvider";
import { CredentialsContext } from "./config/CredentialsContext";
import RootStack from "./navigators/RootStack";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");

  const checkLoginCredentials = () => {
    AsyncStorage.getItem("lalkaarCredentials")
      .then((result) => {
        if (result !== null) {
          setStoredCredentials(JSON.parse(result));
        } else {
          setStoredCredentials(null);
        }
      })
      .catch((error) => console.log(error));
  };
  if (!appReady) {
    return (
      <AppLoading
        startAsync={checkLoginCredentials}
        onFinish={() => setAppReady(true)}
        onError={console.warn}
      />
    );
  }
  return (
    <ApolloProviderWrapper>
      <CredentialsContext.Provider
        value={{ storedCredentials, setStoredCredentials }}
      >
        <RootStack />
      </CredentialsContext.Provider>
    </ApolloProviderWrapper>
  );
}
