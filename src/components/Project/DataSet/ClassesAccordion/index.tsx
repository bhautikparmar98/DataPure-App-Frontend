import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import React from 'react';
import { ROLES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import { IProject } from '../../List/types/project';

interface ClassesAccordionProps {
  project: IProject | null;
  loading: boolean;
}

const ClassesAccordion: React.FC<ClassesAccordionProps> = ({
  project,
  loading,
}) => {
  const { role } = useAuth();

  if (!project) return null;

  //* only available for admin and client level
  if (role === ROLES.ANNOTATOR.value || role === ROLES.QA.value) return null;

  return (
    <Card sx={{ my: 2 }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography>Classes</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {loading && (
            <Box justifyContent="center" alignItems="center" sx={{ my: 3 }}>
              <Typography>Loading..</Typography>
            </Box>
          )}

          {!loading && (
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {project.classes?.map((cl) => (
                <ListItem key={cl._id}>
                  <Box
                    sx={{
                      backgroundColor: cl.color,
                      borderRadius: '100%',
                      width: '30px',
                      height: '30px',
                      mr: 1,
                    }}
                  />

                  <ListItemText primary={cl.name} />
                </ListItem>
              ))}
            </List>
          )}
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};

export default ClassesAccordion;
