// react
import { useEffect, useState } from 'react';
// @mui
import { Box, Checkbox, TableRow, TableCell, TableSortLabel } from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
// styles
import { TableHeadStyle } from './styles';
// interfaces
import { ProductListHeadProps } from './interfaces';
// constants
import { HEAD_LABELS } from './constants';
//----------------------------------------------------------------------

export default function ProductListHead({
  order,
  orderBy,
  rowCount,
  numSelected,
  currentTab,
  onRequestSort,
  onSelectAllClick,
}: ProductListHeadProps) {
  const [labels, setLabels] = useState(HEAD_LABELS);

  useEffect(() => {
    if (currentTab === 'listings') {
      setLabels(HEAD_LABELS);
    } else {
      const newLabels = HEAD_LABELS.filter((label) =>
        ['#', 'name', 'sku', 'edit'].includes(label.id)
      );
      setLabels(newLabels);
    }
  }, [currentTab]);

  return (
    <TableHeadStyle>
      <TableRow className="row">
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={(event) => onSelectAllClick(event.target.checked)}
          />
        </TableCell>
        {labels.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              IconComponent={UnfoldMoreIcon}
              className={headCell.id === 'expand' ? 'hide-sort-icon' : ''}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={() => onRequestSort(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box className="visuallyHidden">
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHeadStyle>
  );
}
