import "react-native-gesture-handler";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { View, Text, Platform, SafeAreaView } from "react-native";
import ApolloProviderWrapper from "./config/ApolloProvider";
import { CredentialsContext } from "./context/CredentialsContext";
import RootStack from "./navigators/RootStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { PushNotificationProvider } from "./context/PushNotificationContext";
import Loader from "./components/Loader";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token?.data;
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [expoPushToken, setExpoPushToken] = useState("");

  const checkLoginCredentials = useCallback(async () => {
    try {
      const result = await AsyncStorage.getItem("lalkaarCredentials");
      if (result !== null) {
        setStoredCredentials(JSON.parse(result));
        setAppIsReady(true);
      } else {
        setStoredCredentials(null);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      console.log("token", token);
      setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
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
      }
    };

    prepare();
  }, [checkLoginCredentials]);

  if (!appIsReady) {
    // You can show a loading screen or custom splash screen here
    return (
      <View>
        <Loader />
      </View>
    );
  }

  return (
    <ApolloProviderWrapper>
      <PushNotificationProvider value={{ expoPushToken, setExpoPushToken }}>
        <CredentialsContext.Provider
          value={{ storedCredentials, setStoredCredentials }}
        >
          <RootStack />
        </CredentialsContext.Provider>
      </PushNotificationProvider>
    </ApolloProviderWrapper>
  );
}
