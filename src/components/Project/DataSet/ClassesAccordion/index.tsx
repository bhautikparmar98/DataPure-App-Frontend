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
import Iconify from 'src/components/Shared/Iconify';
import { ROLES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import { IProject } from '../../List/types/project';

interface ClassesAccordionProps {
  project: IProject | null;
  loading: boolean;
  setClassAddOpen: (bool:boolean) => void
}

const ClassesAccordion: React.FC<ClassesAccordionProps> = ({
  project,
  loading,
  setClassAddOpen
}) => {
  const { role } = useAuth();

  if (!project) return null;

  //* only available for admin and client level
  if (role === ROLES.ANNOTATOR.value || role === ROLES.QA.value) return null;

  return (
    <Card sx={{ my: 2 , width : '30%'}}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{color:'rgba(97,111,228,255)'}}/>}
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
              <Box onClick={()=>{setClassAddOpen(true)}} sx={{color:'rgba(97,111,228,255)',cursor:'pointer', width:'inherit', textAlign:'right'}}>Add More +</Box>
              {project.classes?.map((cl) => (
                <ListItem key={cl._id}>
                  <Box sx={{display:'flex', width:'inherit',m:0, borderRadius:40 , border:'0.5px solid #e3dfde'}}>
                    <Box
                      sx={{
                        backgroundColor: cl.color,
                        borderRadius: '100%',
                        width: '20px',
                        height: '20px',
                        ml: 1,
                        mt:0.5
                      }}
                    />
                    <ListItemText sx={{ml:1, mt:0.3}} primary={cl.name} />
                    <Iconify icon="ph:pencil-simple" onClick={()=>{}} sx={{alignItems:'flex-end', color:'rgba(97,111,228,255)',m:1}}></Iconify>
                    <Iconify icon="mdi:delete" onClick={()=>{}} sx={{alignItems:'flex-end', color:'red', m:1}}></Iconify>
                  </Box>
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
