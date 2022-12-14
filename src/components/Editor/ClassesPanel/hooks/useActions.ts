import { useState } from 'react';
import {
  changeAnnotationsClass,
  deleteAnnotations,
  setMultiselectAnnotators,
  toggleAnnotationVisibility,
} from 'src/redux/slices/classes/classes.slice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import _ from 'lodash';


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

  const dispatch = useDispatch();

  const multiselectedAnnotators : any  = useSelector((state: RootState) => state.classes.multiselectedAnnotators);

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
      toggleAnnotationVisibility({
        classId: selectedClassIndex,
        annotationIds: checkedIds,
        visible,
      })
    );
    let multiselectedAnnotatorsArray : any = _.cloneDeep(multiselectedAnnotators); 
    multiselectedAnnotatorsArray = multiselectedAnnotatorsArray.map((anno:any)=>{
      if(checkedIds.includes(anno.id)) anno.visible = !anno.visible
      return anno
    })
    dispatch(
      setMultiselectAnnotators({multiselectedAnnotatorsArray})
    )
  }; 
  const deleteInstances = () => {
    const checkedIds = getCheckedIds();
    dispatch(
      deleteAnnotations({
        classId: selectedClassIndex,
        annotationIds: checkedIds,
      })
    );
    const multiselectedAnnotatorsArray : any = []
    dispatch(setMultiselectAnnotators({multiselectedAnnotatorsArray}))

    setDeleteModelVisible(false);
  };

  const changeClass = () => {
    if (typeof newClassIndex === 'number' && newClassIndex >= 0) {
      const checkedIds = getCheckedIds();
      dispatch(
        changeAnnotationsClass({
          oldClassIndex: selectedClassIndex,
          newClassIndex,
          annotationIds: checkedIds,
        })
      );
      const multiselectedAnnotatorsArray : any = []
      dispatch(setMultiselectAnnotators({multiselectedAnnotatorsArray}))
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
    classItem: { label: string; classId: number; color:string} | null
  ) => {
    if (classItem && classItem?.classId >= 0) {
        setNewClassIndex(classItem.classId);
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
