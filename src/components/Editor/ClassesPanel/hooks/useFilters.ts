import { SelectChangeEvent } from '@mui/material/Select';

import { selectClass } from 'src/redux/slices/classes/classes.slice';
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'src/redux/store';
const useFilters = () => {
  const classes = useSelector((state: RootState) => state.classes.classes);
  const selectedClassIndex = useSelector((state: RootState) => state.classes.selectedClassIndex);
  const dispatch = useDispatch();

  const classesFilters = classes.map((classItem, i) => ({
    label: classItem.name,
    classId: i,
  }));

  const handleClassSelect = useCallback(
    (classIndex: number) => {
      dispatch(selectClass({ classIndex }));
    },
    [selectedClassIndex]
  );

  return {
    classes,
    selectedClassIndex,
    classesFilters,
    handleClassSelect,
  };
};

export default useFilters;
