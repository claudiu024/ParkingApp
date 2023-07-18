import "expo-dev-client";
import { styles } from "./styles";
import { TextInput } from "react-native-paper";
import { Text, View } from "react-native";
export default function ReserveInfo(props) {
  return (
    <View>
      <TextInput
        label={<Text style={{ color: "#CCCCFE" }}>{props.label}</Text>}
        textColor="#ddd"
        style={styles.input}
        placeholderTextColor="#CCCCFE"
        mode="flat"
        {...props}
      />
    </View>
  );
}
