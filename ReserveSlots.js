import "expo-dev-client";
import { styles } from "./styles";
import { Text, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Checkbox, TextInput, Button, Searchbar } from "react-native-paper";
import {
  makePostRequest,
  options,
  initialState,
  checkValidaton,
  Inputs,
  hasNaNatributes,
} from "./services";
import DarkSelectList from "./DarkSelectLIst";
import theme from "./Theme";
import ReserveInfo from "./ReserveInfo";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { enGB, registerTranslation } from "react-native-paper-dates";
import DarkInputs from "./DarkInputs";
import Reservation from "./Reservation";

export default function ReserveSlots({ route, navigation }) {
  registerTranslation("en-GB", enGB);
  id = route.params.id;
  const reservation = new Reservation();

  const data = [
    { key: "1", value: "First Floor" },
    { key: "2", value: "Second Floor" },
    { key: "3", value: "Third Floor" },
    { key: "4", value: "Fourth Floor" },
  ];
  // const [selected, setSelected] = useState("");
  const [inputs, setInputs] = useState(Inputs);
  const DateFormatter = new Intl.DateTimeFormat("en-us", options);
  const [states, setStates] = useState(initialState);
  const [open, setOpen] = useState(false);
  const empty_fields_error = "Please fill all fields first";
  const onDismissRangePicker = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmRangePicker = useCallback(
    ({ startDate, endDate }) => {
      setOpen(false);

      setStates({
        ...states,
        range: { startDate: startDate, endDate: endDate },
      });
    },
    [setOpen, states]
  );
  const [visible, setVisible] = useState(false);

  const onDismissTimePicker = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirmTimePicker = useCallback(
    ({ hours, minutes }) => {
      setVisible(false);
      setStates({ ...states, StartTime: { hours: hours, minutes: minutes } });
    },
    [setVisible, states]
  );

  useEffect(() => {
    setStates({ ...states, placeholder: states.min + "-" + states.max });
  }, [states.min]);
  // useEffect(() => {
  //   async function getData() {
  //     const url1 = `http://192.168.221.245:5000//ParkingSlots${id}`;

  //     const response1 = await fetch(url1).catch((e) => console.log(e));
  //     const data1 = await response1.json().catch((e) => console.log(e));
  //     setSlots(data1);

  //     // do what you want with data1 and data2 here
  //   }
  //   getData();
  // }, []);

  useEffect(() => {
    setStates({
      ...states,
      EndTime: {
        hours: parseInt(states.StartTime.hours) + parseInt(inputs.ParkingHours),
        minutes: states.StartTime.minutes,
      },
    });
  }, [inputs.ParkingHours, states.StartTime]);
  function setDatesfromClock() {
    today = new Date();
    let StartDate = today.setHours(
      states.StartTime.hours,
      states.StartTime.minutes
    );
    let EndDate = today.setHours(states.EndTime.hours, states.EndTime.minutes);
    // console.log();
    if (!isNaN(EndDate)) {
      reservation.setStartDate = DateFormatter.format(StartDate);
      reservation.setEndDate = DateFormatter.format(EndDate);
    }
    // console.log(
    //   today + "\n" + reservation.getStartDate + "\n" + reservation.EndDate
    // );
  }
  function setDatesfromCalendar() {
    reservation.setStartDate = DateFormatter.format(states.range.startDate);
    reservation.setEndDate = DateFormatter.format(states.range.endDate);
    // console.log(reservation);
  }
  async function setReservationSlot() {
    if (states.randomSlots) {
      reservation.setSlot = generateRandomNumber();
    } else {
      // const response1 = await fetch(
      //   `http://192.168.221.245:5000/SlotNumberbyID${inputs.slots}`
      // ).catch((e) => console.log(e));
      // const data1 = await response1.json();
      axios
        .get(`http://192.168.221.245:5000/SlotIDbyNumber${inputs.slots}`)
        .then((response) => {
          let id = response.data[0].idParkingSlots;
          axios
            .get(`http://192.168.221.245:5000/searchReservationBySlotID${id}`)
            .then((response) => {
              console.log(response.data);
              if (response.data.reserved) {
                addError("Selected slot is reserved on that period of time");
              } else {
                reservation.setSlot = id;
                axios.post("http://192.168.221.245:5000/submit", reservation);
              }
            });
          // reservation.setSlot = response.data[0].idParkingSlots;
          // makePostRequest("http://192.168.221.245:5000/submit", reservation);
        })
        .catch((err) => console.log(err));
      // .then(
      //   makePostRequest(`http://192.168.221.245:5000/ParkingSlots${id}`, {
      //     reserved: 1,
      //     slot_number: inputs.slots,
      //   })
      // )
      // .catch((err) => console.log(err));
    }
  }
  // function compare
  function generateRandomNumber() {
    console.log("generating number");

    return (
      Math.floor(Math.random() * (states.max - states.min + 1)) + states.min
    );
  }
  function setResevationDates() {
    if (states.onlyToday) {
      setDatesfromClock();
    } else {
      if (states.range.startDate == null || states.range.endDate == null) {
        addError("Please choose reservation dates ");
      } else {
        removeError("Please choose reservation dates ");
        setDatesfromCalendar();
      }
    }
  }

  function addError(error) {
    if (!states.errors.includes(error))
      //daca este eroare noua
      setStates({
        ...states,
        errors: [...states.errors, error],
      });
    // states.errors.return;
  }
  function removeError(error) {
    states.errors.removeElementByValue(error);
    setStates({ ...states, errors: states.errors });
  }
  function formHaveErrors() {
    if (states.errors.length > 0) return true;
  }
  function Validate() {
    if (states.randomSlots) {
      delete inputs.slots;
    }

    // else removeError(empty_fields_error);
    if (inputs.slots < states.min || inputs.slots > states.max) {
      // console.log(states.min, states.max, inputs.slot);

      addError(`Slot should be between ${states.min} and ${states.max}`);
    } else
      removeError(`Slot should be between ${states.min} and ${states.max}`);
    if (!checkValidaton(inputs)) {
      addError(empty_fields_error);
    } else removeError(empty_fields_error);

    if (parseInt(inputs.ParkingHours) > 24) {
      addError("Parking hours should be less than a day \nUncheck only today");
    } else
      removeError(
        "Parking hours should be less than a day \nUncheck only today"
      );
  }
  async function Submit() {
    Validate();
    if (formHaveErrors()) {
      return;
    } else {
      setResevationDates();
      // setStates({ ...states, StartTime: { hours: 2, minutes: 3 } });
      reservation.setPlateNumber = inputs.PlateNumber;
      reservation.setLocation = id;

      // console.log(reservation);

      // console.log("Valid form:", checkValidaton(reservation), reservation);

      // console.log(slots, PlateNumber, b.getHours());
      // const response1 = await fetch(url1).catch((e) => console.log(e));
      await setReservationSlot();
      // console.log(reservation);
      // makePostRequest(`http://192.168.221.245:5000/ParkingSlots${id}`, {
      //   reserved: 1,
      //   slot_number: inputs.slots,
      // });
    }
  }

  function getPlaceholderInfo(val) {
    switch (val) {
      case "1":
        setStates({ ...states, min: 1, max: 50 });

        break;
      case "2":
        setStates({ ...states, min: 51, max: 100 });

        break;
      case "3":
        setStates({ ...states, min: 101, max: 150 });

        break;
      case "4":
        setStates({ ...states, min: 151, max: 200 });

        break;
    }
  }

  return (
    <View
      style={{
        backgroundColor: "#343541",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SelectList
        setSelected={(val) => {
          setInputs({ ...inputs, selected: val }), getPlaceholderInfo(val);
        }}
        data={data}
        save="key"
        placeholder="Pick a floor"
        inputStyles={{ color: "white", width: 200 }}
        dropdownStyles={{
          height: 165,
          color: "white",
          backgroundColor: "#464757",
        }}
        boxStyles={{ width: 250, backgroundColor: "#464757" }}
        dropdownTextStyles={{ color: "white", backgroundColor: "#464757" }}
        dropdownItemStyles={{ color: "white", backgroundColor: "#464757" }}
        search={false}
      />

      <View style={styles.checkboxContainer}>
        <Text style={styles.text}>Random parking slot:</Text>
        <Checkbox.Item
          style={styles.checkbox}
          status={states.randomSlots ? "checked" : "unchecked"}
          labelVariant={"headlineSmall"}
          onPress={() => {
            setStates({ ...states, randomSlots: !states.randomSlots });
          }}
        />
      </View>

      {!states.randomSlots ? (
        <DarkInputs
          label="Slot"
          onChangeText={(newValue) => {
            setInputs({ ...inputs, slots: newValue });
          }}
          value={inputs.slots}
          placeholder={states.placeholder}
          keyboardType="numeric"
          maxLength={3}
        />
      ) : (
        ""
      )}
      <DarkInputs
        label="Plate"
        value={inputs.PlateNumber}
        onChangeText={(newValue) => {
          setInputs({ ...inputs, PlateNumber: newValue });
        }}
        placeholder="Plate Number"
      />
      <View style={styles.checkboxContainer}>
        <Text style={styles.text}>Only for today:</Text>
        <Checkbox.Item
          style={styles.checkbox}
          status={states.onlyToday ? "checked" : "unchecked"}
          labelVariant={"headlineSmall"}
          onPress={() => {
            setStates({ ...states, onlyToday: !states.onlyToday });
          }}
        />
      </View>

      {states.onlyToday ? (
        <View>
          <Button onPress={() => setVisible(true)}>
            Pick the time of arriving
          </Button>
          <DarkInputs
            label="Parking Hours"
            value={inputs.ParkingHours}
            onChangeText={(newValue) => {
              setInputs({ ...inputs, ParkingHours: newValue });
            }}
            placeholder="Number of hours"
            keyboardType="numeric"
          ></DarkInputs>
        </View>
      ) : (
        <Button onPress={() => setOpen(true)}>Pick date range</Button>
      )}

      <DatePickerModal
        locale="en-US"
        style={styles.container}
        mode="range"
        visible={open}
        onDismiss={onDismissRangePicker}
        startDate={states.range.startDate}
        endDate={states.range.endDate}
        onConfirm={onConfirmRangePicker}
      />
      <TimePickerModal
        visible={visible}
        onDismiss={onDismissTimePicker}
        onConfirm={onConfirmTimePicker}
        hours={states.StartTime.hours}
        minutes={states.StartTime.minutes}
      />
      {!states.onlyToday ? (
        !states.range.endDate == null ? (
          <ReserveInfo
            start={String(DateFormatter.format(states.range.startDate))}
            end={String(DateFormatter.format(states.range.endDate))}
          />
        ) : (
          ""
        )
      ) : !isNaN(states.EndTime.hours) ? (
        <ReserveInfo
          start={String(
            states.StartTime.hours + ":" + states.StartTime.minutes
          )}
          end={String(states.EndTime.hours + ":" + states.StartTime.minutes)}
        />
      ) : (
        ""
      )}
      <Button
        style={styles.button}
        labelStyle={styles.buttonText}
        onPress={() => {
          Submit();
        }}
        // theme={theme}
        // textColor="#ddd"
        // buttonColor="#6F5CBA"
        mode="contained"
      >
        Submit
      </Button>

      {states.errors.length > 0 ? (
        <Text style={styles.error}>{states.errors[0]} </Text>
      ) : (
        ""
      )}
    </View>
  );
}
