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
import { Layer } from 'src/constants';
import { Box } from '@mui/system';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { updateInstance } from 'src/redux/slices/layers/layers.actions';
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
  const { layers } = useAppSelector(({ layers }) => layers);

  const [memoisedLayers, setMemoisedLayers] = useState<Layer[] | []>([]);

  const handleLayers = _.debounce(() => {
    setMemoisedLayers(layers);
  }, 2000);

  useEffect(() => {
    handleLayers();
  }, [layers]);

  const handleInstanceToggle = (
    layerId: number,
    instanceId: string,
    visible: boolean
  ) => {
    dispatch(updateInstance(layerId, instanceId, { visible }));
  };

  return (
    <div className={styles.list}>
      {memoisedLayers.length > 0 &&
        memoisedLayers.map((layer, layerId) => (
          <Accordion key={`layer-accordion-${layerId}`}>
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Box className={styles.layerTitle}>
                <Checkbox />
                <div
                  className={styles.circle}
                  style={{ background: layer.color }}
                />
                {layer.title}
                {layer.instances.length > 0
                  ? ' (' + layer.instances.length + ')'
                  : ''}
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{ margin: 0, backgroundColor: 'transparent' }}
            >
              <List dense={true}>
                {layer.instances.map((instance, i) => (
                  <ListItem key={instance.id} sx={{ marginTop: -2 }}>
                    <Checkbox />
                    <ListItemText primary={`Instance ${i + 1}`} />
                    {instance.visible ? (
                      <Icon
                        icon="majesticons:eye"
                        className={styles.eyeIcon}
                        onClick={(e) =>
                          handleInstanceToggle(layerId, instance.id, false)
                        }
                      />
                    ) : (
                      <Icon
                        icon="eva:eye-off-fill"
                        className={styles.eyeIcon}
                        onClick={(e) =>
                          handleInstanceToggle(layerId, instance.id, true)
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
