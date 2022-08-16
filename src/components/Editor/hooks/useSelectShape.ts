import { useState } from 'react';

const useSelectShape = () => {
  const [selectedId, selectShape] = useState('');
  // deselect when clicked on empty area

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape('');
    }
  };

  return {
    selectShape,
    selectedId,
    checkDeselect,
  };
};

export default useSelectShape;
