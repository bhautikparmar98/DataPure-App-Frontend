import MUIAutocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import { memo, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";
import styled from "@emotion/styled";
import { Class } from "src/constants";

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input.MuiAutocomplete-input": {
    fontSize: 14,
  },
});

interface Props {
  classes: Class[];
  selectedClassIndex: number;
  handleClassSelect: (
    e: any,
    classItem: { label: string; classId: number } | null
  ) => void;
}

const Autocomplete = ({
  handleClassSelect,
  classes,
  selectedClassIndex,
}: Props) => {
  const classesFilters = classes.map((classItem, i) => ({
    label: classItem.name,
    classId: i,
  }));

  return (
    <MUIAutocomplete
      disablePortal
      id="editor-classes"
      options={classesFilters}
      sx={{ width: 250 }}
      value={{
        label: classes[selectedClassIndex]?.name || "Choose Class",
        classId: selectedClassIndex,
      }}
      style={{ color: classes[selectedClassIndex]?.color || "#000" }}
      onChange={handleClassSelect}
      fullWidth
      renderInput={(params) => <StyledTextField {...params} />}
      isOptionEqualToValue={(option, value) => option.label === value.label}
    />
  );
};

const propsAreEqual = (prev: Props, next: Props) => {
  return (
    prev.classes.length === next.classes.length &&
    prev.selectedClassIndex === next.selectedClassIndex
  );
};

export default memo(Autocomplete, propsAreEqual);
