import { selectClass } from "src/redux/slices/classes/classes.slice";
import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "src/redux/store";
const useFilters = () => {
  const { classes, selectedClassIndex } = useSelector(
    (state: RootState) => state.classes
  );
  const dispatch = useDispatch();

  const classesFilters = classes.map((classItem, i) => ({
    label: classItem.name,
    classId: i,
  }));

  const handleClassSelect = useCallback(
    (_: any, classItem: { label: string; classId: number } | null) => {
      if (classItem && classItem.classId >= 0) {
        dispatch(selectClass({ classId: classItem.classId }));
      }
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
