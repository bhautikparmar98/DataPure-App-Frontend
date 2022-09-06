import { useState } from 'react';
import {
  changeAnnotationsClass,
  deleteAnnotations,
  toggleAnnotationsVisibility,
} from 'src/redux/slices/classes/classes.actions';
import { useAppDispatch } from 'src/redux/store';

interface Checks {
  [instanceId: string]: boolean;
}

type Props = {
  checks: Checks;
  selectedClassIndex: number;
};

const useActions = ({ checks, selectedClassIndex }: Props) => {
  const [deleteModalVisible, setDeleteModelVisible] = useState(false);
  const [changeClassModalVisible, setChangeClassModalVisible] = useState(false);

  const [newClassIndex, setNewClassIndex] = useState<number>();

  const dispatch = useAppDispatch();

  const getCheckedIds = () => {
    const ids: string[] = [];
    for (const [key, checked] of Object.entries(checks)) {
      if (checked) ids.push(key);
    }
    return ids;
  };

  // Bulk changes (delete, hide, change class) for global redux classes' state

  const toggleInstancesVisibility = (visible = false) => {
    const checkedIds = getCheckedIds();
    dispatch(
      toggleAnnotationsVisibility(selectedClassIndex, checkedIds, visible)
    );
  };
  const deleteInstances = () => {
    const checkedIds = getCheckedIds();
    dispatch(deleteAnnotations(selectedClassIndex, checkedIds));
    setDeleteModelVisible(false);
  };

  const changeClass = () => {
    if (typeof newClassIndex === 'number' && newClassIndex >= 0) {
      const checkedIds = getCheckedIds();
      dispatch(
        changeAnnotationsClass(selectedClassIndex, newClassIndex, checkedIds)
      );
      handleChangeClassModalVisibility();
    }
  };

  // Modals Handling:

  const handleDeleteModalVisibility = (open = false) =>
    setDeleteModelVisible(open);

  const handleChangeClassModalVisibility = (open = false) =>
    setChangeClassModalVisible(open);

  // set the target class that we want instances to be moved to
  const handleNewClassChange = (
    _: any,
    classItem: { label: string; classId: number } | null
  ) => {
    if (classItem && classItem?.classId >= 0) {
      classItem?.classId >= 0 && setNewClassIndex(classItem.classId);
    }
  };

  return {
    toggleInstancesVisibility,
    deleteInstances,
    changeClass,
    deleteModalVisible,
    changeClassModalVisible,
    handleChangeClassModalVisibility,
    handleDeleteModalVisibility,
    handleNewClassChange,
    newClassIndex,
  };
};

export default useActions;
