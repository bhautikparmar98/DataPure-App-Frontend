import styled from '@emotion/styled';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Checkbox, Icon, IconButton } from '@mui/material';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import { Box } from '@mui/system';
import { memo, ChangeEvent, useState } from 'react';
import Iconify from 'src/components/Shared/Iconify';
import { grey } from '@mui/material/colors';

import { Class } from 'src/constants';
import { updateAnnotation } from 'src/redux/slices/classes/classes.slice';
import styles from './annotations.module.css';
import { useDispatch } from 'react-redux';

const AccordionSummary = memo(
  styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor: 'white',
    border: 'none',
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

const [showAllAnnotations, setShowAllAnnotations] = useState(true)

const dispatch = useDispatch();

const handleAllAnnotationToggle = (e:any) => {
  e.stopPropagation()
  const visible = !showAllAnnotations
  classItem.annotations.forEach((anno)=>{
    dispatch(
      updateAnnotation({
        classId: index,
        annotationId: anno.id ,
        update: { visible },
      })
    );
  })
  setShowAllAnnotations(prev=>!prev)
}

  return (
    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
      <Box className={styles.classTitle}>
        <Box sx={{ width: 46, display: 'inline-block'}} >
          {index === selectedClassIndexInSorted &&
            classItem.annotations.length > 0 && (
              <Checkbox
                indeterminate={allChecked === AllChecked['someChecked']}
                checked={
                  allChecked === AllChecked['allChecked'] &&
                  Object.keys(checks).filter((id: string) => checks[id])
                    .length > 0
                }
                 sx={{
                    color: grey[800],
                    '&.Mui-checked': {
                      color: grey[600],
                    },
                    '&.MuiCheckbox-indeterminate': {
                      color: grey[600],
                    },
                  }}
                onChange={toggleAll}
              />
            )}
        </Box>
        <Box
          className={styles.circle}
          style={{ background: classItem.color, marginTop:'7px' }}
        />
        <Box sx={{alignText:'center', mt:1}}>
          {classItem.name}
          {classItem.annotations.length > 0
            ? ' (' + classItem.annotations.length + ')'
            : ''}
        </Box>
        <IconButton onClick={(e)=>handleAllAnnotationToggle(e)} sx={{marginLeft:'auto'}}>
        {showAllAnnotations ? (
          <Iconify icon="majesticons:eye" className={styles.eyeIcon} sx={{mr:'24px', '& :hover':{backgroundColor:'transparent'}}} fontSize={20}  />
        ) : (
          <Iconify icon="eva:eye-off-fill" className={styles.eyeIcon} sx={{mr:'24px'}} fontSize={20}  />
        )}
      </IconButton>
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


