import { createStackNavigator } from "@react-navigation/stack";
import Signup from "../screens/Signup";
import Welcome from "../screens/Welcome";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../screens/Login";
import { Colors } from "../components/Theme/Styles";
import Dashboard from "../screens/Dashboard";
import { CredentialsContext } from "../context/CredentialsContext";
import ProfilePage from "../screens/ProfilePage";
import AcceptRequest from "../screens/AcceptRequest";
import MapScreen from "../screens/MapScreen";
import DataTable from "../screens/DataTable";

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
                <Stack.Screen name="ProfilePage" component={ProfilePage} />
                <Stack.Screen name="AcceptRequest" component={AcceptRequest} />
                <Stack.Screen name="MapScreen" component={MapScreen} />
                <Stack.Screen name="DataTable" component={DataTable} />
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
