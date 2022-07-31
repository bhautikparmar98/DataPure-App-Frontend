export interface ProductTabsProps {
  TABS: Array<object>;
  currentTab: string;
  handleTabChange: (e: React.SyntheticEvent, newTab: string) => void;
}
