import { selectClass } from 'src/redux/slices/classes/classes.actions';
import { useAppDispatch, useAppSelector } from 'src/redux/store';

const useFilters = () => {
  const { classes, selectedClassIndex } = useAppSelector(
    ({ classes }) => classes
  );
  const dispatch = useAppDispatch();

  const classesFilters = classes.map((classItem, i) => ({
    label: classItem.name,
    classId: i,
  }));

  const handleClassSelect = (
    _: any,
    classItem: { label: string; classId: number } | null
  ) => {
    if (classItem) {
      classItem.classId >= 0 ? dispatch(selectClass(classItem.classId)) : null;
    }
  };

  return {
    classes,
    selectedClassIndex,
    classesFilters,
    handleClassSelect,
  };
};

export default useFilters;
