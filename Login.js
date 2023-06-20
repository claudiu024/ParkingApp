import "expo-dev-client";
import { StyleSheet, Text, View, Button, Platform } from "react-native";
import { styles } from "./styles";
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";
signIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    this.setState({ userInfo });
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
    }
  }
};
export default function Login() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Image style={styles.logo} source={require("./assets/logo.png")} /> */}
        <Text style={styles.title}>My App</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Welcome to my app!</Text>
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis
          tellus vitae nisi dapibus malesuada quis eget metus.
        </Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Copyright © 2023 My App</Text>
        {/* <Text>Your expo push token is {expoPushToken}</Text> */}
      </View>
    </View>
  );
}
