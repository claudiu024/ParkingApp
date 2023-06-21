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

// # ' 192.168.221.245' //hotspot
// # '192.168.0.180' //camin
// #192.168.0.141: //acasa

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [parkslot, setParkSlot] = useState([]);
  const navigation = useNavigation();

  const cities = [
    { key: "1", value: "Brașov" },
    { key: "2", value: "București" },
    // { key: "3", value: "Third Floor" },
    // { key: "4", value: "Fourth Floor" },
  ];

  useEffect(() => {
    async function getData() {
      const url1 = "http://192.168.0.141:5000/getlocations";
      const url2 = "http://192.168.0.141:5000/AvailableParkingSlots";

      const response2 = await fetch(url2);
      const data2 = await response2.json();
      const response1 = await fetch(url1).catch((e) => console.log(e));
      const data1 = await response1.json();
      setParkSlot(data2);
      setLocations(data1);

      console.log("Location", data1[0].city, selectedCity);
      // do what you want with data1 and data2 here
    }
    getData();
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const onChangeSearch = (query) => setSearchQuery(query);
  function GoToReserveSlots(id) {
    navigation.navigate("ReserveSlots", { id: id });
  }

  if (!locations && !parkslot) {
    return (
      <View>
        <Text>loading</Text>
        {/* {locations.map((location) => (
        <View>{<Text>{{ location }}</Text>}</View>
      ))}
     */}
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
        {locations &&
          parkslot &&
          locations
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
                  onPress={() => GoToReserveSlots(parkslot[key].id)}
                >
                  {/* <SearchBar
                      placeholder="Search"
                      onChangeText={onChangeSearch}
                      inputStyle={styles.buttonText}
                      value={searchQuery}
                      // mode={"view"}
                    /> */}
                  <Text style={styles.location_title}>{location.name}</Text>
                  <Text style={styles.text}>{location.city}</Text>
                  <Text style={styles.text}>{location.address}</Text>
                  <Text style={styles.text}>
                    {parkslot[key].slots}/ {location.capacity}
                  </Text>
                </TouchableOpacity>
                {/* <Text style={styles.text}>{parkslot[key]}</Text> */}
              </View>
            ))}
      </View>
    );
  }
}
