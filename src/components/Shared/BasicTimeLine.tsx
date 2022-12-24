import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { styled } from '@mui/material';


const TimelineItem_ = styled(TimelineItem)({
    minHeight:30,
    color:'black'
});

const TimelineDot_ = styled(TimelineDot)({
    margin:0
})

export default function BasicTimeline({value}:any) {

  console.log(value)

  let color1 = "grey"
  let color2 = 'grey'
  let color3 = 'grey'

  switch(value) {
    case 'ANNOTATION_INPROGRESS':
      color1 = 'primary'
      break;
    case 'PENDING_QA':
      color1 = 'success'
      color2 = 'warning'
      break;
    case 'PENDING_CLIENT_REVIEW':
      color1 = 'success'
      color2 = 'success'
      color3 = 'warning'
      break;
    case 'PENDING_REDO' :
      color1 = 'success'
      color2 = 'error'
      break;
    case 'DONE':
      color1 = 'success'
      color2 = 'success'
      color3 = 'success'
      break;
    default:
      // code block
  }

  
  return (
    <Timeline sx={{transform:'rotate(270deg)',padding:0, height:5, marginLeft:-8}}>
      <TimelineItem_ >
        <TimelineSeparator>
          <TimelineDot_ color={color1}/>
          <TimelineConnector/>
        </TimelineSeparator>
        <TimelineContent></TimelineContent>
      </TimelineItem_>
      <TimelineItem_>
        <TimelineSeparator>
          <TimelineDot_ color={color2}/>
          <TimelineConnector/>
        </TimelineSeparator>
        <TimelineContent></TimelineContent> 
      </TimelineItem_>
      <TimelineItem_>
        <TimelineSeparator>
          <TimelineDot_ color={color3}/>
        </TimelineSeparator>
        <TimelineContent></TimelineContent>
      </TimelineItem_>
    </Timeline>
  );
}
