import { useState, memo, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { Checkbox } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Icon } from '@iconify/react';

import styles from './annotations.module.css';
import { Class } from 'src/constants';
import { Box } from '@mui/system';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { updateAnnotation } from 'src/redux/slices/classes/classes.actions';
import _ from 'lodash';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(0),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

function Annotations() {
  const dispatch = useAppDispatch();
  const { classes } = useAppSelector(({ classes }) => classes);

  const [memoisedClass, setMemoisedClass] = useState<Class[] | []>([]);

  const handleClasses = _.debounce(() => {
    setMemoisedClass(classes);
  }, 2000);

  useEffect(() => {
    handleClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classes]);

  const handleAnnotationToggle = (
    classId: number,
    annotationId: string,
    visible: boolean
  ) => {
    dispatch(updateAnnotation(classId, annotationId, { visible }));
  };

  return (
    <div className={styles.list}>
      {memoisedClass.length > 0 &&
        memoisedClass.map((classItem, classId) => (
          <Accordion key={`class-accordion-${classId}`}>
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Box className={styles.classTitle}>
                <Checkbox />
                <div
                  className={styles.circle}
                  style={{ background: classItem.color }}
                />
                {classItem.name}
                {classItem.annotations.length > 0
                  ? ' (' + classItem.annotations.length + ')'
                  : ''}
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{ margin: 0, backgroundColor: 'transparent' }}
            >
              <List dense={true}>
                {classItem.annotations.map((annotation, i) => (
                  <ListItem key={annotation.id} sx={{ marginTop: -2 }}>
                    <Checkbox />
                    <ListItemText primary={`Annotation ${i + 1}`} />
                    {annotation.visible ? (
                      <Icon
                        icon="majesticons:eye"
                        className={styles.eyeIcon}
                        onClick={(e) =>
                          handleAnnotationToggle(classId, annotation.id, false)
                        }
                      />
                    ) : (
                      <Icon
                        icon="eva:eye-off-fill"
                        className={styles.eyeIcon}
                        onClick={(e) =>
                          handleAnnotationToggle(classId, annotation.id, true)
                        }
                      />
                    )}
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}

export default Annotations;
