import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Checkbox, Grid } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import ListItemIcon from '@mui/material/ListItemIcon';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

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
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

function Annotations() {
  return (
    <div>
      <Accordion>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>
            <Checkbox />
            RC
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ margin: 0, backgroundColor: 'transparent' }}>
          <Grid item xs={12} md={6}>
            <Demo>
              <List dense={true}>
                <ListItem sx={{ marginTop: -2 }}>
                  <ListItemIcon>
                    <RemoveRedEyeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Single-line item" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RemoveRedEyeIcon />
                  </ListItemIcon>
                  <ListItemText primary="High Strength" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RemoveRedEyeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Place Holder" />
                </ListItem>
              </List>
            </Demo>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>
            <Checkbox />
            RC
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ margin: 0, backgroundColor: 'transparent' }}>
          <Grid item xs={12} md={6}>
            <Demo>
              <List dense={true}>
                <ListItem sx={{ marginTop: -2 }}>
                  <ListItemIcon>
                    <RemoveRedEyeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Single-line item" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RemoveRedEyeIcon />
                  </ListItemIcon>
                  <ListItemText primary="High Strength" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RemoveRedEyeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Place Holder" />
                </ListItem>
              </List>
            </Demo>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>
            <Checkbox />
            RC
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ margin: 0, backgroundColor: 'transparent' }}>
          <Grid item xs={12} md={6}>
            <Demo>
              <List dense={true}>
                <ListItem sx={{ marginTop: -2 }}>
                  <ListItemIcon>
                    <RemoveRedEyeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Single-line item" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RemoveRedEyeIcon />
                  </ListItemIcon>
                  <ListItemText primary="High Strength" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RemoveRedEyeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Place Holder" />
                </ListItem>
              </List>
            </Demo>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default Annotations;
