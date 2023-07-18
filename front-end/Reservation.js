export default class Reservation {
  #PlateNumber;
  #location;
  #slot;
  #StartDate;
  #EndDate;

  constructor(plate_number, location, slot, StartDate, EndDate) {
    this.#PlateNumber = plate_number; //private fields
    this.#location = location;
    this.#slot = slot;
    this.#StartDate = StartDate;
    this.#EndDate = EndDate;
  }
  get getPlate_number() {
    return this.plate_number;
  }

  set setPlateNumber(plate_number) {
    this.PlateNumber = plate_number;
  }

  get getLocation() {
    return this.location;
  }

  set setLocation(location) {
    this.location = location;
  }

  get getSlot() {
    return this.slot;
  }

  set setSlot(slot) {
    this.slot = slot;
  }

  get getStartDate() {
    return this.StartDate;
  }

  set setStartDate(StartDate) {
    this.StartDate = StartDate;
  }

  get getEndDate() {
    return this.EndDate;
  }

  set setEndDate(EndDate) {
    this.EndDate = EndDate;
  }

  setReservationDates(StartDate, EndDate) {
    this.StartDate = StartDate;
    this.EndDate = EndDate;
  }
}
