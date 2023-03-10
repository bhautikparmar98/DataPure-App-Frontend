// @mui
import {
  Box,
  Checkbox,
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel,
} from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  order: 'asc' | 'desc';
  orderBy: string;
  rowCount: number;
  headLabel?: any[];
  numSelected: number;
  onRequestSort: (property: string) => void;
  onSelectAllClick: (checked: boolean) => void;
};

const TABLE_HEAD = [
  { id: 'index', label: 'SNo.', alignRight: false },
  { id: 'photo', label: 'Photo', alignRight: false, center: true },
  { id: 'fileName', label: 'Name', alignRight: false },
  { id: 'createdAt', label: 'Date of upload', alignRight: false },
  {
    id: 'annotatedDate',
    label: 'Date Annotated',
    alignRight: false,
    center: true,
  },
  { id: 'Status', label: 'Status', alignRight: false, center: true },
  { id: '', label: 'Edit', center: true },
];

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

export default function ReviewListHead({
  order,
  orderBy,
  rowCount,
  headLabel = TABLE_HEAD,
  numSelected,
  onRequestSort,
  onSelectAllClick,
}: Props) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox sx={{color:'white', align:'center', paddingLeft:'26px'}}
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={(event) => onSelectAllClick(event.target.checked)}
          />
        </TableCell>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={
              headCell.center
                ? 'center'
                : headCell.alignRight
                ? 'right'
                : 'left'
            }
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={() => onRequestSort(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

