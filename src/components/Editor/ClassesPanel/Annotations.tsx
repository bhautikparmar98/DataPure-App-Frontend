import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Checkbox } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import { Box } from '@mui/system';
import _ from 'lodash';
import { Class } from 'src/constants';
import { useAppSelector } from 'src/redux/store';
import styles from './annotations.module.css';
import Annotation from './Annotation';

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
  padding: theme.spacing(0, 2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

function Annotations() {
  const { classes } = useAppSelector(({ classes }) => classes);

  const [memoisedClass, setMemoisedClass] = useState<Class[] | []>([]);

  const handleClasses = _.debounce(() => {
    setMemoisedClass(classes);
  }, 2000);

  useEffect(() => {
    handleClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classes]);

  return (
    <div className={styles.list}>
      {memoisedClass.length > 0 &&
        memoisedClass.map((classItem, classId) => (
          <Accordion
            key={`class-accordion-${classId}`}
            sx={{ marginBottom: 3 }}
          >
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
              sx={{
                margin: 0,
                backgroundColor: 'transparent',
              }}
            >
              <List
                dense={true}
                sx={{
                  maxHeight: 220,
                  overflowY: 'auto',
                }}
              >
                {classItem.annotations.length > 0 ? (
                  classItem.annotations.map(({ visible, id }, i) => (
                    <Annotation
                      key={`${classId}-${i}`}
                      id={id!}
                      classId={classId}
                      visible={visible}
                      index={i}
                    />
                  ))
                ) : (
                  <div
                    style={{
                      color: '#757a7f',
                      fontStyle: 'italic',
                      fontSize: 14,
                      textAlign: 'center',
                    }}
                  >
                    No Instances yet
                  </div>
                )}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}

export default Annotations;
