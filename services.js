import axios from "axios";
export async function makePostRequest(path, obj, slot) {
  // console.log(queryObj);
  //   queryObj = { slot: obj };

  console.log(obj, path);
  axios.post(path, obj).then(
    (response) => {
      var result = response.data;
      slot = response.data;
      console.log(result);
    },
    (error) => {
      console.log(error);
    }
  );
}
export let options = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
};

export const initialState = {
  placeholder: "select a floor first",

  min: "",
  max: "",
  range: { startDate: null, endDate: null },
  StartTime: { hours: null, minutes: null },
  EndTime: { hours: null, minutes: null },
  onlyToday: false,
  randomSlots: false,
  errors: [],
  // selected: false,
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

Array.prototype.removeElementByValue = function (value) {
  console.log("before:", this);
  console.log("value:", value);
  const index = this.indexOf(value);
  console.log(index);
  if (index != -1) this.splice(index, 1);
  console.log("AFTEr:", this);
  return this;
};

module.export = Array;

// Object.prototype.hasNullAttributes =function(value){
//   this.values
// }
export function isNullish(obj) {
  var state = false;
  Object.values(obj).every((value) => {
    if (value === null || value.isNaN) {
      state = true;
      return false;
    } else return true;
  });

  return state;
}
