import { Icon } from '@iconify/react';
import { Checkbox } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import { updateAnnotation } from 'src/redux/slices/classes/classes.actions';
import { memo } from 'react';

import ListItemText from '@mui/material/ListItemText';
import { useAppDispatch } from 'src/redux/store';
import styles from './annotations.module.css';

interface Props {
  id: string;
  index: number;
  classId: number;
  visible: boolean;
}

const Annotation = memo(({ id, classId, visible, index }: Props) => {
  const dispatch = useAppDispatch();

  const handleAnnotationToggle = (
    classId: number,
    annotationId: string,
    visible: boolean
  ) => {
    dispatch(updateAnnotation(classId, annotationId, { visible }));
  };
  return (
    <ListItem
      key={`${classId}-listItem-${index}`}
      sx={{
        marginTop: -2,
        // marginBottom: -5,
        paddingBottom: 0,
        paddingTop: 1,
      }}
    >
      <Checkbox />
      <ListItemText primary={`Instance ${index + 1}`} />
      {visible ? (
        <Icon
          icon="majesticons:eye"
          className={styles.eyeIcon}
          onClick={(e) => handleAnnotationToggle(classId, id, false)}
        />
      ) : (
        <Icon
          icon="eva:eye-off-fill"
          className={styles.eyeIcon}
          onClick={(_e) => handleAnnotationToggle(classId, id, true)}
        />
      )}
    </ListItem>
  );
});
export default Annotation;
