import React from 'react';
import UserList from './children/List';
import MachineVisionForm from './children/Form';
import Stack from '@mui/material/Stack';

const MachineVision = () => (
  <Stack>
    <MachineVisionForm />
    <UserList />
  </Stack>
);

export default MachineVision;
