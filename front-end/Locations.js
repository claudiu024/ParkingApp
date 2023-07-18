import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { styles } from "./styles";
import MapView from "react-native-maps";
// import { SelectList } from "react-native-dropdown-select-list";
import DarkSelectList from "./DarkSelectLIst";
import { Checkbox, TextInput, Button, Searchbar } from "react-native-paper";
import axios from "axios";

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [parkslot, setParkSlot] = useState([]);
  const navigation = useNavigation();

  const cities = [
    { key: "1", value: "Brașov" },
    { key: "2", value: "București" },
  ];

  useEffect(() => {
    async function getData() {
      const url1 = "http://192.168.221.245:5000/getlocations";

      axios
        .get(url1)
        .then((response) => setLocations(response.data))
        .catch((e) => console.error(e));
    }
    getData();
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const onChangeSearch = (query) => setSearchQuery(query);
  function GoToReserveSlots(location) {
    navigation.navigate("ReserveSlots", { location: location });
  }

  if (!locations) {
    return (
      <View>
        <Text>loading</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Searchbar
          placeholder="Search by name"
          onChangeText={onChangeSearch}
          inputStyle={styles.buttonText}
          value={searchQuery}
          elevation={4}
          style={{ backgroundColor: "#464757", width: 250, margin: 15 }}
          //
        />
        <DarkSelectList
          setSelected={(val) => {
            setSelectedCity({ val });
          }}
          data={cities}
          placeholder="Pick a City"
        />
        {locations
          .filter(
            (e) =>
              e.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
              e.city == selectedCity["val"]
          )
          .map((location, key) => (
            <View key={key} style={styles.location_container}>
              <TouchableOpacity
                style={styles.container}
                title=""
                onPress={() => {
                  GoToReserveSlots(location);
                }}
              >
                <Text style={styles.location_title}>{location.name}</Text>
                <Text style={styles.text}>{location.city}</Text>
                <Text style={styles.text}>{location.address}</Text>
                <Text style={styles.text}>
                  {location.available_spaces} slots left
                </Text>
              </TouchableOpacity>
            </View>
          ))}
      </View>
    );
  }
}
