export interface ProductListToolbarProps {
  numSelected: number;
  filterName: string;
  currentTab: string;
  onFilterName: (value: string) => void;
  onDeleteProducts: VoidFunction;
}
