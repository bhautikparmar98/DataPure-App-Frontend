import { Box, Divider, List, Paper, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import axiosInstance from 'src/utils/axios';
import ClientItem from './ClientItem';

interface ClientListProps {
  onSelectedClient: (id: number) => void;
  selectedClientId: number | null;
}

const ClientList: React.FC<ClientListProps> = ({
  onSelectedClient,
  selectedClientId,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    const getClients = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get('/user/clients');
        const { clients } = response.data;

        setClients(clients);
      } catch (error) {
        console.log('error', error);
        enqueueSnackbar('Something went wrong with downloading clients', {
          variant: 'error',
        });
      }
      setLoading(false);
    };

    getClients();
  }, []);

  return (
    <Paper elevation={3} sx={{ overflowY: "auto", height: 'calc(100vh - 0px)', display: 'flex', flex: 1 }}>
      <Stack flex={1} pt={1}>
        <Box paddingY={3} paddingX={3}>
          <Typography variant="h5">Active Clients</Typography>
        </Box>

        <Box flex={1}>
          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          >
            {clients.map((item, index) => (
              <ClientItem
                key={item.id}
                item={item}
                latest={index + 1 === clients.length}
                onSelect={onSelectedClient}
                selectedClientId={selectedClientId}
              />
            ))}
          </List>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ClientList;
