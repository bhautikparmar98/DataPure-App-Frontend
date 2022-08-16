// @mui
import { TableRow, TableCell, TableHead } from '@mui/material';

// ----------------------------------------------------------------------

const cellStyle = {
  boxShadow: '0 0 0 !important',
};

const visuallyHidden = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
} as const;

type Props = {
  headLabel: any[];
};

export default function UserListHead({ headLabel }: Props) {
  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
            sx={{ ...cellStyle }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
