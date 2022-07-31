import { Product } from '../../../types';

export interface ListingTableProps {
  filteredProducts: Product[];
  order: 'asc' | 'desc';
  selected: string[];
  currentTab: string;
  filterName: string;
  orderBy: string;
  rowCount: number;
  numSelected: number;
  emptyRows: number;
  rowsPerPage: number;
  page: number;
  isNotFound: boolean;
  onRequestSort: (property: string) => void;
  handleClick: (name: string) => void;
  onSelectAllClick: (checked: boolean) => void;
}
