import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Checkbox } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';

import { Box } from '@mui/system';
import _ from 'lodash';
import { shallowEqual, useSelector } from 'react-redux';
import { Class } from 'src/constants';
import Annotation from './Annotation';
import styles from './annotations.module.css';
import useChecks from './hooks/useChecks';
import { RootState } from 'src/redux/store';
// Styled Components

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
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

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
  checks: Checks;
  allChecked: AllChecked;
  handleChecks: (checks: Checks) => void;
  handleAllChecks: (allChecked: AllChecked) => void;
  lastSortType: string;
};

function Annotations({
  classes,
  checks,
  handleChecks,
  handleAllChecks,
  allChecked,
  lastSortType,
}: Props) {
  const selectedClassIndex = useSelector(
    ({ classes }: RootState) => classes.selectedClassIndex
  );

  const { toggleOne, toggleAll } = useChecks({
    classes,
    selectedClassIndex,
    handleChecks,
    handleAllChecks,
    checks,
  });

  // const annos = useSelector(
  //   ({ classes }) => classes.classes.map((c) => c.annotations),
  //   shallowEqual
  // );

  // const [memoisedClass, setMemoisedClass] = useState<Class[] | []>([]);

  // // const handleClasses = _.debounce(() => {
  // //   setMemoisedClass(classes);
  // // }, 2000);

  // // useEffect(() => {
  // //   // handleClasses();
  // //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // // }, [lastSortType, classes]);

  return (
    <div className={styles.list}>
      {classes.length > 0 &&
        classes.map((classItem, index) => (
          <Accordion
            className={
              selectedClassIndex === index ? styles.activeAccordion : ''
            }
            key={classItem._id}
            sx={{ marginBottom: 3 }}
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Box className={styles.classTitle}>
                <Box sx={{ width: 46, display: 'inline-block' }}>
                  {selectedClassIndex === index &&
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
                      id={id}
                      classIndex={index}
                      selectedClassIndex={selectedClassIndex}
                      visible={visible}
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

const preventRenders = (prev: Props, next: Props) => {
  // console.log(_.isEqual(prev, next), next);
  return _.isEqual(prev, next);
};

// export default memo(Annotations, preventRenders);
export default Annotations;
