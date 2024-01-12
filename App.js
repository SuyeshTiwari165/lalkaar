import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";
import Dashboard from "./components/Dashboard/Dashboard";
import SOSRequestPage from "./components/SOSRequestPage/SOSRequestPage";
import Notifications from "./components/Notifications/Notifications";
import ApolloProviderWrapper from "./config/ApolloProvider";
import { AuthProvider, useAuth } from './config/AuthContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <ApolloProviderWrapper>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </ApolloProviderWrapper>
  );
};

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator initialRouteName={user ? "Dashboard" : "Login"}>
      {!user ? (
        // If the user is not authenticated, only show Login and Registration screens
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Registration" component={Registration} />
        </>
      ) : (
        // If the user is authenticated, show other screens
        <>
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="SOSRequestPage" component={SOSRequestPage} />
          <Stack.Screen name="Notifications" component={Notifications} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default App;
