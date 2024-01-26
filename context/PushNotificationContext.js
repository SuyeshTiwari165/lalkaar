// PushNotificationContext.js
import React, { createContext, useContext, useState } from "react";

const PushNotificationContext = createContext();

export const usePushNotificationContext = () => {
  return useContext(PushNotificationContext);
};

export const PushNotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState("");

  const updateExpoPushToken = (token) => {
    setExpoPushToken(token);
  };

  return (
    <PushNotificationContext.Provider
      value={{ expoPushToken, updateExpoPushToken }}
    >
      {children}
    </PushNotificationContext.Provider>
  );
};
