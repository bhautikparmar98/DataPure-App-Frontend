import DeleteIcon from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  MenuItem,
  Modal,
  Select,
  Typography,
  TextField,
} from "@mui/material";

import styled from "@emotion/styled";
import styles from "./filters.module.css";

import useActions from "../hooks/useActions";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";
import { useEffect, useState } from "react";
import useChecks from "../hooks/useChecks";
import { Class } from "src/constants";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input.MuiAutocomplete-input": {
    fontSize: 14,
  },
});

interface Checks {
  [instanceId: string]: boolean;
}

type Props = {
  selectedClassIndex: number;
  checks: Checks;
  classesFilters: {
    label: string;
    classId: number;
  }[];
  sortBy: (sortType: "a-z" | "newest" | "oldest") => void;
};

const FilterActions = ({
  checks,
  selectedClassIndex,
  classesFilters,
  sortBy,
}: Props) => {
  const {
    toggleInstancesVisibility,
    deleteInstances,
    changeClass,
    deleteModalVisible,
    changeClassModalVisible,
    handleChangeClassModalVisibility,
    handleDeleteModalVisibility,
    handleNewClassChange,
    newClassIndex,
  } = useActions({
    checks,
    selectedClassIndex,
  });


  const [actionsEnable, setActionsEnable] = useState(false)
  const highlightedInstance = useSelector((state: RootState) => state.classes.highlightedInstance);

  // useEffect(()=>{
  //   if(highlightedInstance) {
  //     console.log(highlightedInstance)
  //     setActionsEnable(true)
  //   }else{
  //     setActionsEnable(false)
  //   }
  // },[highlightedInstance])


  return (
    <Box
      component="form"
      noValidate 
      sx={{
        display: "grid",
        gridTemplateColumns: { sm: "1fr 1fr" },
        gap: 2,
        marginTop: 2,
        paddingBottom: 2,
      }}
    >
      {/* Bulk Actions */}
      <Grid justifyContent={"space-between"}>
        <label htmlFor="editor-action" className={styles.label}>
          Action
        </label>
        <Select
          labelId="editor-action"
          id="editor-action"
          value={0}
          fullWidth
          className={styles.input}
          MenuProps={{
            disableScrollLock: true,
          }}
          sx={{ height: 40 }}
          disabled={!Object.values(checks).find((check) => check === true)}
        >
          <MenuItem value={0} sx={{ display: "none" }}>
            Choose Action
          </MenuItem>

          <MenuItem onClick={(e) => toggleInstancesVisibility(false)} value={1}>
            Hide
          </MenuItem>
          <MenuItem onClick={(e) => toggleInstancesVisibility(true)} value={2}>
            Unhide
          </MenuItem>
          <MenuItem
            onClick={(_e) => handleDeleteModalVisibility(true)}
            value={3}
          >
            Delete
          </MenuItem>
          <MenuItem
            onClick={(_e) => handleChangeClassModalVisibility(true)}
            value={4}
          >
            Change Class
          </MenuItem>
        </Select>
      </Grid>

      {/* Classes/Instances Sort */}
      <div>
        <label htmlFor="editor-sortBy" className={styles.label}>
          Sort By
        </label>
        <Select
          labelId="editor-sortBy"
          id="editor-sortBy"
          value={0}
          fullWidth
          className={styles.input}
          MenuProps={{
            disableScrollLock: true,
          }}
          sx={{ height: 40 }}
        >
          <MenuItem value={0} sx={{ display: "none" }}>
            Sort By
          </MenuItem>
          <MenuItem value={1} onClick={(_e) => sortBy("a-z")}>
            Class A-Z
          </MenuItem>
          <MenuItem value={2} onClick={(_e) => sortBy("newest")}>
            Newest
          </MenuItem>
          <MenuItem value={3} onClick={(_e) => sortBy("oldest")}>
            Oldest
          </MenuItem>
        </Select>
      </div>

      {/* Modal for instances deletion */}
      <Modal
        open={deleteModalVisible}
        onClose={(e) => handleDeleteModalVisibility()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="body2" mb={2}>
            Are you sure you want to delete instances?
          </Typography>
          <Box justifyContent="center" display="flex" pt={2}>
            <Button
              onClick={(e) => handleDeleteModalVisibility()}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>

            <Button
              onClick={deleteInstances}
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal for moving instances into another class */}
      <Modal
        open={changeClassModalVisible}
        onClose={(e) => handleChangeClassModalVisibility()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Choose the new class:
          </Typography>
          <Box>
            <Autocomplete
              disablePortal
              id="editor-classes-selection"
              options={classesFilters.filter(
                (_classItem, i) => i !== selectedClassIndex
              )}
              sx={{ mt: 2, mb: 4 }}
              fullWidth
              onChange={handleNewClassChange}
              renderInput={(params) => (
                <StyledTextField {...params} placeholder="Choose Class" />
              )}
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
            />
            <Box display="flex" justifyContent={"center"}>
              <Button
                onClick={(e) => handleChangeClassModalVisibility()}
                variant="outlined"
                sx={{ mr: 2, color: "grey.500", borderColor: "grey.500" }}
              >
                Cancel
              </Button>
              <Button
                onClick={changeClass}
                variant="outlined"
                disabled={
                  typeof newClassIndex === "number" && newClassIndex >= 0
                    ? false
                    : true
                }
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default FilterActions;
