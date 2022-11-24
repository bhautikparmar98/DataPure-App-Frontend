import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import { memo, useEffect, useMemo, useState } from 'react';

import { useSelector } from 'react-redux';
import { Class } from 'src/constants';
import { RootState } from 'src/redux/store';
import Annotation from './Annotation';
import styles from './annotations.module.css';
import useChecks from '../hooks/useChecks';
import Summary from './Summary';

const Accordion = memo(
  styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }))
);

const AccordionDetails = memo(
  styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(0, 2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }))
);

// Types

interface Checks {
  [instanceId: string]: boolean;
}

enum AllChecked {
  'allUnchecked',
  'someChecked',
  'allChecked',
}

type Props = {
  classes: Class[];
  updateFiltersChecks: (newChecks: Checks) => void;
};

function Annotations({ classes, updateFiltersChecks }: Props) {
  const selectedClassIndex = useSelector((state: RootState) => state.classes.selectedClassIndex);

  const highlightedInstance = useSelector((state: RootState) => state.classes.highlightedInstance);
  const highlightedClass = classes.find((classItem) =>
    classItem.annotations.find((anno) => anno.id === highlightedInstance)
  );

  const selectedClassName = useSelector((state: RootState) => state.classes.classes[selectedClassIndex]?.name || '');
  const selectedClassIndexInSorted = useMemo(
    () => classes.findIndex((classItem) => classItem.name === selectedClassName),
    [classes, selectedClassIndex]
  );

  const { toggleOne, toggleAll, checks, allChecked } = useChecks({
    classes,
    selectedClassIndex,
    updateFiltersChecks,
  });

  useEffect(() => {
    if (highlightedInstance && highlightedClass) {
      //open the class and scroll to it
    }
  }, [highlightedInstance]);

  return (
    <div className={styles.list}>
      {classes.length > 0 &&
        classes.map((classItem, index) => (
          <Accordion
            className={selectedClassIndex === index ? styles.activeAccordion : ''}
            key={classItem._id}
            sx={{ marginBottom: 3 }}
            id={classItem._id === highlightedClass?._id ? 'highlightedClass' : ''}>
            <Summary
              index={index}
              selectedClassIndexInSorted={selectedClassIndexInSorted}
              classItem={classItem}
              checks={checks}
              allChecked={allChecked}
              toggleAll={toggleAll}
            />
            <AccordionDetails
              sx={{
                margin: 0,
                backgroundColor: 'transparent',
              }}>
              <List
                dense={true}
                sx={{
                  maxHeight: 220,
                  overflowY: 'auto',
                }}>
                {classItem.annotations.length > 0 ? (
                  classItem.annotations.map(({ visible, id }, i) => (
                    <Annotation
                      id={id}
                      classIndex={index}
                      selectedClassIndex={selectedClassIndex}
                      visible={visible}
                      selected={false}
                      annoIndex={i}
                      key={`${classItem._id}-${i}`}
                      toggleOne={toggleOne}
                      checked={id ? checks[id!] : false}
                    />
                  ))
                ) : (
                  <div
                    style={{
                      color: '#757a7f',
                      fontStyle: 'italic',
                      fontSize: 14,
                      textAlign: 'center',
                    }}>
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

// const preventRenders = (prev: Props, next: Props) => {
//   return _.isEqual(prev, next);
// };

// export default memo(Annotations, preventRenders);
export default Annotations;
