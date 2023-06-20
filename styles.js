import { StyleSheet } from "react-native";
import { withSafeAreaInsets } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#343541",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    alignSelf: "center",
    margin: 0,
    // paddingHorizontal: 20,
  },
  buttonContainer: {
    // flexDirection: "row",
    justifyContent: "center",
    // alignItems: "center",
    // marginTop: 20,
  },
  button: {
    width: 180,
    height: 60,

    // backgroundColor: "#975DCC",
    // borderColor: "white",
    // borderWidth: 5,
    // borderBottomWidth: 1,
    // borderRadius: 20,
    marginHorizontal: 8,
    justifyContent: "center",
    // alignItems: "center",
    margin: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#ddd",
    opacity: 0.3,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    // color: "#ddd",
    // fontFamily: "Lobster"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: "#888",
    fontSize: 12,
  },
  map: {
    width: "100%",
    heigh: "100%",
  },
  location_container: {
    borderWidth: 2,
    borderColor: "#975DCC",
    width: 300,
    margin: 10,
    height: 110,

    // BorderStyle: "double",
    // borderStyle: "double",
  },
  location_title: {
    fontSize: 30,
    textAlign: "center",
    color: "white",
  },
  checkbox: {
    alignSelf: "center",
  },
  // slot_button: {
  //   backgroundColor: "#BB94D6",
  //   borderRadius: 100,
  //   width: 60,
  //   height: 60,
  //   textAlign: "center",
  //   verticalAlign: "middle",
  //   margin: 4,
  //   color: "#FFFFFF",
  // },
  // slot_container: {
  //   // textAlign: "center",
  //   // verticalAlign: "middle",
  //   backgroundColor: "#343541",
  //   // flex: 1,
  //   flexWrap: "wrap",
  //   flexDirection: "row",
  // },
  input: {
    backgroundColor: "#464757",
    // opacity: 0.7,
    // color: "#ddd",
    fontSize: 20,
    width: 250,
    margin: 10,
    // borderColor: "#ddd",
    borderRadius: 10,
  },
  error: {
    fontSize: 20,
    color: "red",
  },
});

export { styles };
