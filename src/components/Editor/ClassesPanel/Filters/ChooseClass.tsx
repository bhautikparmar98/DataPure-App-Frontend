import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Class } from 'src/constants';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';

interface Props {
  classes: Class[];
  selectedClassIndex: number;
  handleClassSelect: (classIndex: number) => void;
}

const ChooseClass = ({
  handleClassSelect,
  classes,
  selectedClassIndex,
}: Props) => {
  const [chosenClassName, setChosenClassName] = useState(
    'Choose class from the list'
  );

  const highlightedInstance = useSelector((state: RootState) => state.classes.highlightedInstance);
  const highlightedClass = classes.find((classItem) =>
    classItem.annotations.find((anno) => anno.id === highlightedInstance)
  );
  const classesList = useMemo(
    () => classes.map((classItem) => classItem.name),
    [classes.length]
  );

  const handleOptionChange = useCallback(
    (e: SelectChangeEvent) => {
      setChosenClassName(e.target.value);
    },
    [chosenClassName]
  );

  useEffect(() => {
    let newIndex = Math.max(classesList.indexOf(chosenClassName), 0);
    newIndex !== selectedClassIndex &&
      handleClassSelect(classesList.indexOf(chosenClassName));
  }, [chosenClassName]);

  useEffect(() => {
    const name = classes[selectedClassIndex]?.name;
    if (name) setChosenClassName(classes[selectedClassIndex]?.name);
  }, [classes.length]);

  useEffect(()=>{
    if(highlightedClass){
      console.log("changinf class")
      setChosenClassName(highlightedClass?.name);
    }
  },[highlightedInstance])

  console.log(highlightedInstance)


  return (
    <>
      <label
        htmlFor="choose_class"
        style={{
          fontFamily: 'Proxima Nova',
          fontSize: 16,
          lineHeight: 2.3,
          color:'rgba(48,63,191,255)'
        }}>
        Choose Class ({classes.length})
      </label>
      <Select
        labelId="choose_class"
        id="choose_class"
        value={chosenClassName}
        defaultValue={classes[selectedClassIndex]?.name}
        fullWidth
        MenuProps={{
          disableScrollLock: true,
        }}
        onChange={handleOptionChange}
        sx={{ height: 40 , backgroundColor: 'white', border: 'none'}}>
        <MenuItem value="Choose class from the list" sx={{ display: 'none' }}>
          Choose Class
        </MenuItem>
        {classesList.map((classItem: string, i) => (
          <MenuItem key={i} value={classesList[i]}>
            {classItem}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

const propsAreEqual = (prev: Props, next: Props) => {
  return (
    prev.classes.length === next.classes.length &&
    prev.selectedClassIndex === next.selectedClassIndex 
  );
};

export default memo(ChooseClass, propsAreEqual);
