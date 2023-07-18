import "expo-dev-client";
import { styles } from "./styles";
import { Text, View } from "react-native";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Checkbox, Button } from "react-native-paper";
import {
  options,
  initialState,
  validReservation,
  formatDate,
} from "./services";
import DarkSelectList from "./DarkSelectLIst";
import ReserveInfo from "./ReserveInfo";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { enGB, registerTranslation } from "react-native-paper-dates";
import DarkInputs from "./DarkInputs";
import Reservation from "./Reservation";
import { useFormik, useFormikContext } from "formik";
import * as yup from "yup";
export default function ReserveSlots({ route, navigation }) {
  registerTranslation("en-GB", enGB);
  const location_id = route.params.location.id;
  const reservation = new Reservation();
  const [isWaiting, setIsWaiting] = useState(false);
  const data = [
    { key: "1", value: "First Floor" },
    { key: "2", value: "Second Floor" },
    { key: "3", value: "Third Floor" },
    { key: "4", value: "Fourth Floor" },
  ];

  const DateFormatter = new Intl.DateTimeFormat("en-us", options);
  const [states, setStates] = useState(initialState);
  const [open, setOpen] = useState(false);

  const onDismissRangePicker = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmRangePicker = useCallback(
    ({ startDate, endDate }) => {
      setOpen(false);

      setDatesfromCalendar(startDate, endDate);
    },
    [setOpen, states]
  );
  const [visible, setVisible] = useState(false);

  const onDismissTimePicker = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  useEffect(() => {
    console.log(formikProps.values.EndDate);
    if (
      formikProps.values.StartDate !== undefined &&
      states.ParkingHours != ""
    ) {
      console.log(formikProps.values.StartDate.getHours(), states.ParkingHours);
      formikProps.values.EndDate.setHours(
        formikProps.values.StartDate.getHours() + parseInt(states.ParkingHours)
      );
    }
  }, [states.ParkingHours]);

  const onConfirmTimePicker = useCallback(
    ({ hours, minutes }) => {
      setVisible(false);
      setDatesfromClock(hours, minutes);
    },
    [setVisible, states]
  );

  useEffect(() => {
    setStates({ ...states, placeholder: states.min + "-" + states.max });
  }, [states.min]);

  function setDatesfromClock(hours, minutes) {
    today = new Date();
    StartDate = new Date(today);
    EndDate = new Date(today);
    StartDate.setHours(hours, minutes);
    EndDate.setHours(parseInt(hours) + parseInt(states.ParkingHours), minutes);

    formikProps.setFieldValue("StartDate", StartDate);
    formikProps.setFieldValue("EndDate", EndDate);

    console.log("FORMik:", states.ParkingHours, hours, EndDate);
  }

  function setDatesfromCalendar(startDate, endDate) {
    formikProps.setFieldValue("StartDate", startDate);
    formikProps.setFieldValue("EndDate", endDate);
  }
  async function setReservationSlot() {
    if (states.randomSlots) {
      reservation.setSlot = generateRandomNumber();
    } else {
      const request = {
        params: {
          slot_number: formikProps.values.Slot,
          location_id: location_id,
        },
      };
      axios
        .get(`http://192.168.221.245:5000/SlotIDbyNumber`, request)
        .then((response) => {
          // reservation2 = new Reservation(response.data[0]);

          const slot_id = response.data[0].idParkingSlots;
          console.log(slot_id);
          // console.log(response.data);
          // console.log(slot_id);
          axios
            .get(
              `http://192.168.221.245:5000/getReservationsBySlotID${slot_id}`
            )
            .then((response) => {
              const found_reservations = response.data;
              console.log("\nFOUND:", found_reservations.length);
              if (
                validReservation(reservation, found_reservations) ||
                found_reservations.length == 0
              ) {
                reservation.setSlot = slot_id;
                axios
                  .post("http://192.168.221.245:5000/submit", reservation)
                  .then(console.log("succesfull submit"));
              } else {
                console.log("is reserved");
              }
            });
        })
        .catch((err) => console.log(err));
    }
  }

  function generateRandomNumber() {
    console.log("generating number");

    return (
      Math.floor(Math.random() * (states.max - states.min + 1)) + states.min
    );
  }

  async function Submit() {
    // setIsWaiting(true);
    console.log("------------------------------------");

    console.log("Reservation Before", reservation);

    reservation.setReservationDates(
      formatDate(formikProps.values.StartDate),
      formatDate(formikProps.values.EndDate)
    );
    reservation.setPlateNumber = formikProps.values.Plate;
    reservation.location_id = location_id;
    console.log("Reservation After", reservation);
    await setReservationSlot();
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
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const ValidationSchema = yup.object().shape({
    StartDate: yup
      .date()
      .typeError("Start date must be a date")
      .required("Choose a Start date")
      .min(yesterday),
    EndDate: yup
      .date()
      .typeError("End Date must be a date")
      .required("Choose an End Date"),
    Floor: yup.string().required("Select a floor first"),
    Slot: states.randomSlots
      ? ""
      : yup
          .number()
          .typeError("Slot must be a number")
          .required("Slot is required")
          .positive()
          .integer()
          .min(states.min)
          .max(states.max),
    Plate: yup.string().required().min(5),
    ParkingHours: states.onlyToday ? yup.number().required().max(23) : "",
  });
  const formikProps = useFormik({
    initialValues: {
      Plate: "",
      Slot: "",
      ParkingHours: "",
      Floor: "",
      onlyToday: false,
    },
    validationSchema: ValidationSchema,
    onSubmit: Submit,
  });

  return (
    <View
      style={{
        backgroundColor: "#343541",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={styles.location_label}>
        Location:{route.params.location.name}
      </Text>
      <DarkSelectList
        name="Floor"
        setSelected={(val) => {
          getPlaceholderInfo(val);
          formikProps.values.Floor = val;
        }}
        data={data}
        save="key"
        placeholder="Pick a floor"
        defaultOption={{ key: "1", value: "First Floor" }}
      />
      {/* <ErrorMessage name="Slot" /> */}
      {formikProps.errors.Floor ? (
        <Text style={styles.error}>{formikProps.errors.Floor}</Text>
      ) : (
        ""
      )}
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
          name="Slot"
          label="Slot"
          onChangeText={formikProps.handleChange("Slot")}
          onBlur={formikProps.handleBlur("Slot")}
          value={formikProps.values.Slot}
          placeholder={states.placeholder}
          keyboardType="numeric"
        />
      ) : (
        ""
      )}
      {formikProps.errors.Slot ? (
        <Text style={styles.error}>{formikProps.errors.Slot}</Text>
      ) : (
        ""
      )}
      <DarkInputs
        name="Plate"
        label="Plate"
        placeholder="Plate Number"
        onChangeText={formikProps.handleChange("Plate")}
        onBlur={formikProps.handleBlur("Plate")}
        value={formikProps.values.Plate}
      />
      {formikProps.errors.Plate ? (
        <Text style={styles.error}>{formikProps.errors.Plate}</Text>
      ) : (
        ""
      )}

      <View style={styles.checkboxContainer}>
        <Text style={styles.text}>Only for today:</Text>
        <Checkbox.Item
          style={styles.checkbox}
          status={formikProps.values.onlyToday ? "checked" : "unchecked"}
          labelVariant={"headlineSmall"}
          onPress={() => {
            try {
              setStates({ ...states, onlyToday: !states.onlyToday });
              // formikProps.values.onlyToday = !formikProps.values.onlyToday;
              formikProps.setFieldValue(
                "onlyToday",
                !formikProps.values.onlyToday
              );
              // console.log(formikProps.values.onlyToday);
              // setStates({ ...states, onlyToday: !states.onlyToday });
            } catch (e) {
              console.log(e);
            }
          }}
          name="onlyToday"
        />
      </View>
      {formikProps.values.onlyToday ? (
        <View>
          <Button mode="contained" onPress={() => setVisible(true)}>
            Pick the start hour
          </Button>
          <DarkInputs
            name="Parking Hours"
            label="Parking Hours"
            // onChangeText={formikProps.setFieldValue("ParkingHours", someNumber)}
            onChangeText={(text) => {
              setStates({ ...states, ParkingHours: text });
              formikProps.setFieldValue("ParkingHours", text);
            }}
            onBlur={formikProps.handleBlur("ParkingHours")}
            value={formikProps.values.ParkingHours}
            placeholder="Number of hours"
            keyboardType="numeric"
          ></DarkInputs>
        </View>
      ) : (
        <Button mode="contained" onPress={() => setOpen(true)}>
          Pick date range
        </Button>
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
        animationType="slide"
      />
      <TimePickerModal
        visible={visible}
        onDismiss={onDismissTimePicker}
        onConfirm={onConfirmTimePicker}
        hours={states.StartTime.hours}
        minutes={states.StartTime.minutes}
        animationType="slide"
      />
      {formikProps.errors.ParkingHours ? (
        <Text style={styles.error}>{formikProps.errors.ParkingHours}</Text>
      ) : (
        ""
      )}
      {formikProps.errors.StartDate ? (
        <Text style={styles.error}>{formikProps.errors.StartDate}</Text>
      ) : (
        ""
      )}

      {formikProps.errors.EndDate ? (
        <Text style={styles.error}>{formikProps.errors.EndDate}</Text>
      ) : (
        ""
      )}
      {formikProps.errors.onlyToday ? (
        <Text style={styles.error}>{formikProps.errors.onlyToday}</Text>
      ) : (
        ""
      )}

      {!formikProps.values.onlyToday ? (
        formikProps.values.StartDate !== undefined ? (
          <ReserveInfo
            start={String(DateFormatter.format(formikProps.values.StartDate))}
            end={String(DateFormatter.format(formikProps.values.EndDate))}
          />
        ) : (
          ""
        )
      ) : formikProps.values.StartDate !== undefined &&
        formikProps.values.EndDate !== undefined ? (
        <ReserveInfo
          start={String(
            formikProps.values.StartDate.getHours() +
              ":" +
              formikProps.values.StartDate.getMinutes()
          )}
          end={String(
            formikProps.values.EndDate.getHours() +
              ":" +
              formikProps.values.EndDate.getMinutes()
          )}
        />
      ) : (
        ""
      )}
      <Button
        style={styles.button}
        labelStyle={styles.buttonText}
        // disabled={!formikProps.isValid}
        onPress={() => {
          // setDatesfromCalendar();
          formikProps.handleSubmit();

          // Submit();
        }}
        mode="contained"
      >
        Submit
      </Button>
    </View>
  );
}
