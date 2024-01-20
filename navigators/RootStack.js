import { createStackNavigator } from "@react-navigation/stack";
import Signup from "../screens/Signup";
import Welcome from "../screens/Welcome";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../screens/Login";
import { Colors } from "../components/Theme/Styles";
import Dashboard from "../screens/Dashboard";
import { CredentialsContext } from "../config/CredentialsContext";

const Stack = createStackNavigator();
const { tertiary, primary } = Colors;
const RootStack = () => {
  return (
    <CredentialsContext.Consumer>
      {({ storedCredentials }) => (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: "transparent",
              },
              headerTintColor: tertiary,
              headerTransparent: true,
              headerTitle: "",
              headerLeftContainerStyle: {
                paddingLeft: 20,
              },
            }}
            initialRouteName="Login"
          >
            {storedCredentials ? (
              <>
                <Stack.Screen
                  options={{ headerTintColor: primary }}
                  name="Welcome"
                  component={Welcome}
                />
                <Stack.Screen name="Dashboard" component={Dashboard} />
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </CredentialsContext.Consumer>
  );
};

export default RootStack;
