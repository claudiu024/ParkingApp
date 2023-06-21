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
  isNullish,
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
  const [isWaiting, setIsWaiting] = useState(false);
  const data = [
    { key: "1", value: "First Floor" },
    { key: "2", value: "Second Floor" },
    { key: "3", value: "Third Floor" },
    { key: "4", value: "Fourth Floor" },
  ];
  const [errors, setErrors] = useState([]);
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

  useEffect(() => {
    setStates({
      ...states,
      EndTime: {
        hours: parseInt(states.StartTime.hours) + parseInt(inputs.ParkingHours),
        minutes: states.StartTime.minutes,
      },
    });
  }, [inputs.ParkingHours, states.StartTime]);

  useEffect(() => {
    console.log("Error updated", errors);
  }, [errors]);

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
      //   `http://192.168.0.141:5000/SlotNumberbyID${inputs.slots}`
      // ).catch((e) => console.log(e));
      // const data1 = await response1.json();
      axios
        .get(`http://192.168.0.141:5000/SlotIDbyNumber${inputs.slots}`)
        .then((response) => {
          // reservation2 = new Reservation(response.data[0]);

          const slot_id = response.data[0].idParkingSlots;
          // console.log(slot_id);
          axios
            .get(`http://192.168.0.141:5000/getReservationsBySlotID${slot_id}`)
            .then((response) => {
              const found_reservations = response.data;

              if (
                validReservation(reservation, found_reservations) ||
                found_reservations.length == 0
              ) {
                reservation.setSlot = slot_id;
                axios.post("http://192.168.0.141:5000/submit", reservation);
              } else {
                addError("Selected slot is reserved on that period of time");
              }
            });
          // reservation.setSlot = response.data[0].idParkingSlots;
          // makePostRequest("http://192.168.0.141:5000/submit", reservation);
        })
        .catch((err) => console.log(err));
      // .then(
      //   makePostRequest(`http://192.168.0.141:5000/ParkingSlots${id}`, {
      //     reserved: 1,
      //     slot_number: inputs.slots,
      //   })
      // )
      // .catch((err) => console.log(err));
    }
  }
  function validReservation(reservation1, reservations_array) {
    reservations_array.every((reservation2) => {
      console.log(reservation1, reservation2);

      if (
        reservation1.StartDate < reservation2.EndDate &&
        reservation2.StartDate < reservation1.EndDate
      ) {
        console.log("Slot is reseved");
        return false;
      } else;
      return true;
    });
  }
  function generateRandomNumber() {
    console.log("generating number");

    return (
      Math.floor(Math.random() * (states.max - states.min + 1)) + states.min
    );
  }
  function validateCalendarDates() {
    if (isNullish(states.range)) {
      addError("Please choose reservation dates ");
    } else {
      // removeError("Please choose reservation dates ");
    }
  }
  function validateClockDates() {
    if (isNullish(states.StartTime) || isNullish(states.EndTime)) {
      addError("Please choose reservation time ");
    } else {
      // removeError("Please choose reservation time ");
    }
  }
  function setResevationDates() {
    if (states.onlyToday) {
      try {
        validateClockDates();
      } catch (e) {
        console.log(e);
      }

      setDatesfromClock();
    } else {
      validateCalendarDates();
      setDatesfromCalendar();
    }
  }

  async function addError(error) {
    if (!errors.includes(error)) {
      //daca este eroare noua
      console.log("eroare noua:", error);

      setErrors((errors) => [...errors, error]);
    }
    console.log(states.errors);
  }
  function removeError(error) {
    // console.log(states.errors);
    if (errors.includes(error)) {
      setErrors(errors.filter((item) => item !== error));
      // (Error)
      console.log("REMOVING");
    }
    //  errors.removeElementByValue(error);
    // setStates({ ...states, errors: states.errors });
  }
  async function formHaveErrors() {
    console.log("FORM ERROR", errors);
    if (errors.length > 0) {
      console.log(errors.length);
      return true;
    } else {
      console.log("false");
      return false;
    }
  }
  async function Validate() {
    if (states.randomSlots) {
      delete inputs.slots;
    }

    // else removeError(empty_fields_error);
    if (!checkValidaton(inputs)) {
      await addError(empty_fields_error);
    } else {
      // removeError(empty_fields_error);
    }
    if (inputs.slots < states.min || inputs.slots > states.max) {
      // console.log(states.min, states.max, inputs.slot);

      await addError(`Slot should be between ${states.min} and ${states.max}`);
      // console.log("slot error:", errors);
    } else {
      // removeError(`Slot should be between ${states.min} and ${states.max}`);
    }
    console.log("Parking HOurs:", inputs.ParkingHours, errors);
    if (parseInt(inputs.ParkingHours) > 24) {
      await addError(
        "Parking hours should be less than a day \nUncheck only today"
      );
    } else {
      // removeError(
      // "Parking hours should be less than a day \nUncheck only today"
      // );
    }
    // const a = await resolveAfter2Seconds();
    // setErrors([]);
    console.log("Erors inside validation:", errors);
  }
  function resolveAfter2Seconds() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("resolved");
      }, 5000);
    });
  }
  async function Submit() {
    setIsWaiting(true);
    console.log("------------------------------------");
    setErrors([]);
    await resolveAfter2Seconds();
    // try {
    await Validate();
    // await resolveAfter2Seconds();

    // console.log(reservation);

    // console.log("Valid form:", checkValidaton(reservation), reservation);

    // console.log(slots, PlateNumber, b.getHours());
    // const response1 = await fetch(url1).catch((e) => console.log(e));
    // await setReservationSlot();
    // } catch (e) {
    //   console.log(e);
    // } finally {
    if (await formHaveErrors()) {
      console.log("haserrors", errors);
    } else {
      console.log("noerrors", errors);
      setResevationDates();
      // setStates({ ...states, StartTime: { hours: 2, minutes: 3 } });
      reservation.setPlateNumber = inputs.PlateNumber;
      reservation.setLocation = id;
    }
    setIsWaiting(false);
    // }
    // console.log(reservation);
    // makePostRequest(`http://192.168.0.141:5000/ParkingSlots${id}`, {
    //   reserved: 1,
    //   slot_number: inputs.slots,
    // });

    console.log("DONE");
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
        locale="en-GB"
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
        disabled={isWaiting}
        onPress={() => {
          Submit();
        }}
        mode="contained"
      >
        Submit
      </Button>

      {errors.length > 0 ? <Text style={styles.error}>{errors[0]} </Text> : ""}
    </View>
  );
}
