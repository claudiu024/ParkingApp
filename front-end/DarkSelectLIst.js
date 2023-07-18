import { SelectList } from "react-native-dropdown-select-list";
export default function DarkSelectList(props) {
  return (
    <SelectList
      save="value"
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
      {...props}
    />
  );
}
