import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deselectInstance } from 'src/redux/slices/classes/classes.slice';

const useSelectShape = () => {
  const [selectedId, selectShape] = useState('');
  const dispatch = useDispatch();

  // deselect when clicked on empty area
  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape('');
      dispatch(deselectInstance());
    }
  };

  return {
    selectShape,
    selectedId,
    checkDeselect,
  };
};

export default useSelectShape;
