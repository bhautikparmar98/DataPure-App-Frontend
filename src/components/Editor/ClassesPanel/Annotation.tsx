import { Icon } from '@iconify/react';
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  ListItem,
  ListItemText,
} from '@mui/material';
import { memo, ChangeEvent } from 'react';
import { updateAnnotation } from 'src/redux/slices/classes/classes.actions';

import { useAppDispatch } from 'src/redux/store';
import styles from './annotations.module.css';

interface Props {
  id: string;
  annoIndex: number;
  classIndex: number;
  selectedClassIndex: number;
  visible: boolean;
  checked: boolean;
  toggleOne: (e: ChangeEvent<HTMLInputElement>, instanceId: string) => void;
}

const Annotation = memo(
  ({
    id,
    classIndex,
    visible,
    annoIndex,
    selectedClassIndex,
    checked,
    toggleOne,
  }: Props) => {
    const dispatch = useAppDispatch();

    const handleAnnotationToggle = (
      classIndex: number,
      annotationId: string,
      visible: boolean
    ) => {
      dispatch(updateAnnotation(classIndex, annotationId, { visible }));
    };
    return (
      <ListItem
        key={`${classIndex}-listItem-${annoIndex}`}
        sx={{
          marginTop: -1,
          paddingBottom: 0,
          paddingTop: 1,
          height: 40,
        }}
      >
        {selectedClassIndex === classIndex ? (
          <FormControlLabel
            label={`Instance ${annoIndex + 1}`}
            sx={{ paddingLeft: 1, flex: 1 }}
            control={
              <Checkbox
                checked={checked || false}
                onChange={(e) => toggleOne(e, id)}
              />
            }
          />
        ) : (
          <ListItemText primary={`Instance ${annoIndex + 1}`} />
        )}
        <IconButton>
          {visible ? (
            <Icon
              icon="majesticons:eye"
              className={styles.eyeIcon}
              onClick={(e) => handleAnnotationToggle(classIndex, id, false)}
              fontSize={20}
            />
          ) : (
            <Icon
              icon="eva:eye-off-fill"
              className={styles.eyeIcon}
              onClick={(_e) => handleAnnotationToggle(classIndex, id, true)}
            />
          )}
        </IconButton>
      </ListItem>
    );
  }
);

export default Annotation;
