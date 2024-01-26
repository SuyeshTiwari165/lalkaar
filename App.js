import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import ApolloProviderWrapper from "./config/ApolloProvider";
import { CredentialsContext } from "./config/CredentialsContext";
import RootStack from "./navigators/RootStack";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  // const [appReady, setAppReady] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Entypo.font);
        checkLoginCredentials();
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        onLayoutRootView();
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
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
  // if (!appReady) {
  //   return (
  //     <AppLoading
  //       startAsync={checkLoginCredentials}
  //       onFinish={() => setAppReady(true)}
  //       onError={console.warn}
  //     />
  //   );
  // }
  return (
    <ApolloProviderWrapper>
      <CredentialsContext.Provider
        value={{ storedCredentials, setStoredCredentials }}
      >
        {/* <View onLayout={onLayoutRootView}> */}
        <RootStack />
        {/* </View> */}
      </CredentialsContext.Provider>
    </ApolloProviderWrapper>
  );
}
