import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
} from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { styles } from "./styles";
// import "expo-dev-client";
import axios from "axios";
import Login from "./Login";
import Locations from "./Locations";
import ReserveSlots from "./ReserveSlots";
import { Provider as PaperProvider, shadow, Button } from "react-native-paper";
import {
  NavigationContainer,
  NativeRouter,
  Route,
  Link,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DefaultTheme, DarkTheme } from "react-native-paper";
import theme from "./Theme";
const Stack = createNativeStackNavigator();

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      console.log("token: " + token);
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

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "#975DCC",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Welcome" }}
          />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Locations" component={Locations} />
          <Stack.Screen
            name="ReserveSlots"
            component={ReserveSlots}
            options={{ title: "Reserve your slot" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const HomeScreen = ({ navigation }) => {
  const GoToProfile = () => {
    navigation.navigate("Login");
  };
  const GoToReservation = () => {
    navigation.navigate("ReserveSlots");
  };
  const GoToLocations = () => {
    navigation.navigate("Locations");
  };
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Welcome to the Home Screen!</Text> */}
      <Text style={styles.title}>Welcome to Park Prep!</Text>
      <Text style={styles.subtitle}>
        Press Reserve now to reserve a parking slot!
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          onPress={GoToLocations}
          style={styles.button}
          labelStyle={styles.buttonText}
          mode="contained"
        >
          Reserve Now
        </Button>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="elevated"
          style={styles.button}
          labelStyle={styles.buttonText}
          // onPress={axios.get()}
          disabled={true}
        >
          Verify Plate
        </Button>
      </View>
    </View>
  );
};

async function registerForPushNotificationsAsync() {
  let token;
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
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
        console.log("Status", status);
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }
  } catch (err) {
    console.log(err);
  }
  return token;
}
