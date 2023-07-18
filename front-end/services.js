export let options = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
};
export function formatDate(date) {
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);
  return `${parts[4].value}-${parts[0].value}-${parts[2].value} ${parts[6].value}:${parts[8].value}:${parts[10].value}`;
}

export const initialState = {
  min: 1,
  max: 50,
  range: { startDate: null, endDate: null },
  StartTime: { hours: null, minutes: null },
  EndTime: { hours: null, minutes: null },
  onlyToday: false,
  randomSlots: false,
  errors: [],
  placeholder: 1 + "-" + 50,
};

export const Inputs = {
  PlateNumber: "",
  slots: "",
  ParkingHours: "1",
  selected: "",
};
export function checkValidaton(obj) {
  let flag = true;
  for (const [key, value] of Object.entries(obj)) {
    if (!value.trim()) flag = false;
  }
  return flag;
  // return Object.values(obj).every((value) => value.trim);
}

export function hasNaNatributes(obj) {
  let flag = false;
  for (const [key, value] of Object.entries(obj)) {
    if (isNaN(value)) flag = true;
  }
  return flag;
}

export function validReservation(reservation1, reservations_array) {
  let flag = true;
  r1_start = new Date(reservation1.StartDate);
  r1_end = new Date(reservation1.EndDate);
  reservations_array.every((reservation2) => {
    r2_start = new Date(reservation1.StartDate);
    r2_end = new Date(reservation1.EndDate);
    if (r1_start < r2_end && r2_start < r1_end) {
      console.log(
        "Reservation1:",
        reservation1,
        "\nReservation2",
        reservation2
      );
      console.log("Slot is reseved");
      flag = false;
      return false;
    } else return true;
  });
  return flag;
}
