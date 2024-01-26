import React, { useCallback, useEffect, useState } from "react";
import { View, Text } from "react-native";
import ApolloProviderWrapper from "./config/ApolloProvider";
import { CredentialsContext } from "./config/CredentialsContext";
import RootStack from "./navigators/RootStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");

  const checkLoginCredentials = useCallback(async () => {
    try {
      const result = await AsyncStorage.getItem("lalkaarCredentials");
      if (result !== null) {
        setStoredCredentials(JSON.parse(result));
      } else {
        setStoredCredentials(null);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync(); // Prevent auto-hiding of splash screen
        await checkLoginCredentials();
        // Other initialization tasks can be added here
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync(); // Hide splash screen when initialization is done
        setAppIsReady(true);
      }
    };

    prepare();
  }, [checkLoginCredentials]);

  if (!appIsReady) {
    // You can show a loading screen or custom splash screen here
    return (
      <View>
        <Text>Loading...</Text>
      </View>
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
