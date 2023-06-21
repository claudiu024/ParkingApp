import "expo-dev-client";
import { StyleSheet, Text, View, Button, Platform } from "react-native";

import { styles } from "./styles";
import { Formik } from "formik";
import * as yup from "yup";
import DarkInputs from "./DarkInputs";
// import {
//   GoogleSignin,
//   GoogleSigninButton,
// //   statusCodes,
// // } from "@react-native-google-signin/google-signin";
// signIn = async () => {
//   try {
//     await GoogleSignin.hasPlayServices();
//     const userInfo = await GoogleSignin.signIn();
//     this.setState({ userInfo });
//   } catch (error) {
//     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//       // user cancelled the login flow
//     } else if (error.code === statusCodes.IN_PROGRESS) {
//       // operation (e.g. sign in) is in progress already
//     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//       // play services not available or outdated
//     } else {
//       // some other error happened
//     }
//   }
// };

export default function Login() {
  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email")
      .required("Email Address is Required"),
    password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required("Password is required"),
  });
  return (
    <Formik
      validationSchema={loginValidationSchema}
      initialValues={{ email: "", password: "" }}
      onSubmit={(values) => console.log(values)}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        isValid,
      }) => (
        <View>
          <DarkInputs
            name="email"
            placeholder="Email Address"
            style={styles.textInput}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
            keyboardType="email-address"
          />
          <DarkInputs
            name="password"
            placeholder="Password"
            style={styles.textInput}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
            secureTextEntry
          />
          <Button onPress={handleSubmit} title="Submit" />
          <Text>{errors.email}</Text>
        </View>
      )}
    </Formik>
  );
}
