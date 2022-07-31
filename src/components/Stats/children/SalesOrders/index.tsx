// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Table,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CardHeader,
  Typography,
  TableContainer,
} from '@mui/material';
// utils
import { fCurrency } from 'src/utils/formatNumber';
// _mock
import { _listings } from 'src/_mock';
// components
import Label from 'src/components/Shared/Label';
import Scrollbar from 'src/components/Shared/Scrollbar';

// ----------------------------------------------------------------------

export default function BankingRecentTransitions() {
  const theme = useTheme();

  return (
    <Card>
      <CardHeader title="Recent Transitions" sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Net Profit</TableCell>
                <TableCell>Expenses</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ship Out QTY</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {_listings.map(({ id, name, image, sku, price, label, qty }, i) => (
                <TableRow key={'row-' + id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        alt={name}
                        src={image}
                        sx={{
                          width: 20,
                          height: 20,
                          boxShadow: (theme) => theme.customShadows.z8,
                        }}
                      />

                      <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>{sku}</TableCell>
                  <TableCell>{fCurrency(price)}</TableCell>
                  <TableCell>{fCurrency(Math.floor(price / 3))}</TableCell>
                  <TableCell style={{ minWidth: 160 }}>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      sx={
                        label === 'Canceled'
                          ? theme.palette?.label?.Delisted
                          : label === 'In Progress'
                          ? theme.palette?.label?.Submitted
                          : theme.palette?.label?.Listed || ''
                      }
                    >
                      {label}
                    </Label>
                  </TableCell>
                  <TableCell>{qty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}
