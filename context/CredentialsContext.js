import { createContext, useContext, useState } from "react";

export const CredentialsContext = createContext({
  storedCredentials: {},
  setStoredCredentials: () => {},
});
