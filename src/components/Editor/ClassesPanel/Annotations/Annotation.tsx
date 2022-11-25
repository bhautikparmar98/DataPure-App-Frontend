import { Icon } from '@iconify/react';
import { Checkbox, FormControlLabel, IconButton, ListItem, ListItemText } from '@mui/material';
import { memo, ChangeEvent } from 'react';
import { updateAnnotation } from 'src/redux/slices/classes/classes.slice';

import { useDispatch } from 'react-redux';
import styles from './annotations.module.css';

interface Props {
  id: string;
  annoIndex: number;
  classIndex: number;
  selectedClassIndex: number;
  selected: boolean;
  visible: boolean;
  checked: boolean;
  toggleOne: (e: ChangeEvent<HTMLInputElement>, instanceId: string) => void;
}

const Annotation = ({
  id,
  classIndex,
  visible,
  annoIndex,
  selectedClassIndex,
  checked,
  selected,
  toggleOne,
}: Props) => {
  const dispatch = useDispatch();

  const handleAnnotationToggle = (classIndex: number, annotationId: string, visible: boolean) => {
    dispatch(
      updateAnnotation({
        classId: classIndex,
        annotationId,
        update: { visible },
      })
    );
  };
  return (
    <ListItem
      id={id}
      key={`${id}-listItem`}
      sx={{
        marginTop: -1,
        paddingBottom: 0,
        paddingTop: 0,
        height: 40,
        background: selected ? 'purple' : 'transparent',
        color: selected ? 'white' : 'black'
      }}>
      {selectedClassIndex === classIndex ? (
        <FormControlLabel
          label={`Instance ${annoIndex + 1}`}
          sx={{ paddingLeft: 2, flex: 1 }}
          control={<Checkbox checked={checked || false} onChange={(e) => toggleOne(e, id)} />}
        />
      ) : (
        <ListItemText sx={{ paddingLeft: 5.6 }} primary={`Instance ${annoIndex + 1}`} />
      )}
      <IconButton onClick={() => handleAnnotationToggle(classIndex, id, !visible)}>
        {visible ? (
          <Icon icon="majesticons:eye" className={styles.eyeIcon} fontSize={20} />
        ) : (
          <Icon icon="eva:eye-off-fill" className={styles.eyeIcon} />
        )}
      </IconButton>
    </ListItem>
  );
};

const propsAreEqual = (prev: Props, next: Props) => {
  return (
    prev.checked === next.checked &&
    prev.visible === next.visible &&
    prev.selectedClassIndex === next.selectedClassIndex &&
    prev.toggleOne === next.toggleOne &&
    prev.selected === next.selected
  );
};

// export default Annotation;
export default memo(Annotation, propsAreEqual);
