import "expo-dev-client";
import { styles } from "./styles";
import { Text, View } from "react-native";
export default function ReserveInfo(props) {
  return (
    <View>
      <Text style={styles.text}>
        Reserved from {props.start}
        {/* :{StartTime.minutes} */}
      </Text>

      <Text style={styles.text}>
        until {props.end}
        {/* :{EndTime.minutes} */}
      </Text>
      {/* <Text>{ParkingHours}</Text> */}
    </View>
  );
}
