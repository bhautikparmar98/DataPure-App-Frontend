import styled from '@emotion/styled';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Checkbox } from '@mui/material';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import { Box } from '@mui/system';
import { memo, ChangeEvent } from 'react';

import { Class } from 'src/constants';
import styles from './annotations.module.css';

const AccordionSummary = memo(
  styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor: 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
  }))
);

enum AllChecked {
  'allUnchecked',
  'someChecked',
  'allChecked',
}

interface Checks {
  [instanceId: string]: boolean;
}

interface Props {
  index: number;
  selectedClassIndexInSorted: number;
  classItem: Class;
  allChecked: AllChecked;
  toggleAll: (e: ChangeEvent<HTMLInputElement>) => void;
  checks: Checks;
}

const Summary = ({
  index,
  selectedClassIndexInSorted,
  classItem,
  allChecked,
  toggleAll,
  checks,
}: Props) => {
  return (
    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
      <Box className={styles.classTitle}>
        <Box sx={{ width: 46, display: 'inline-block' }}>
          {index === selectedClassIndexInSorted &&
            classItem.annotations.length > 0 && (
              <Checkbox
                indeterminate={allChecked === AllChecked['someChecked']}
                checked={
                  allChecked === AllChecked['allChecked'] &&
                  Object.keys(checks).filter((id: string) => checks[id])
                    .length > 0
                }
                onChange={toggleAll}
              />
            )}
        </Box>
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
  );
};

const propsAreEqual = (prev: Props, next: Props) => {
  return (
    prev.classItem.annotations.length === next.classItem.annotations.length &&
    prev.selectedClassIndexInSorted === next.selectedClassIndexInSorted &&
    prev.allChecked === next.allChecked
  );
};

export default memo(Summary, propsAreEqual);
