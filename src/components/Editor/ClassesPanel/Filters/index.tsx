import Box from "@mui/material/Box";

import * as React from "react";
import FilterActions from "./FilterActions";

import styles from "./filters.module.css";
import useFilters from "../hooks/useFilters";
import Autocomplete from "./Autocomplete";

interface Checks {
  [instanceId: string]: boolean;
}

type Props = {
  checks: Checks;
  sortBy: (sortType: "a-z" | "newest" | "oldest") => void;
};

const Filters = ({ checks, sortBy }: Props) => {
  const { classes, selectedClassIndex, classesFilters, handleClassSelect } =
    useFilters();

  return (
    <Box
      className={styles.form}
      sx={{
        marginTop: 2.5,
      }}
    >
      <label htmlFor="editor-classes" className={styles.label}>
        Choose Class ({classes.length})
      </label>

      <Autocomplete
        classes={classes}
        selectedClassIndex={selectedClassIndex}
        handleClassSelect={handleClassSelect}
      />
      <FilterActions
        checks={checks}
        selectedClassIndex={selectedClassIndex}
        classesFilters={classesFilters}
        sortBy={sortBy}
      />
    </Box>
  );
};

export default React.memo(Filters);
