export interface ProductListHeadProps {
  order: 'asc' | 'desc';
  orderBy: string;
  rowCount: number;
  numSelected: number;
  currentTab: string;
  onRequestSort: (property: string) => void;
  onSelectAllClick: (checked: boolean) => void;
}
