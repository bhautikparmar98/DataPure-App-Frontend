import { useState } from 'react';

//constants
import { TAB_EDIT_PRODUCT } from 'src/constants/tabs';

export const useProductFormTabs = () => {
  const [currentTab, setCurrentTab] = useState('basic_listing');
  const handleTabChange = (e: React.SyntheticEvent, newTab: string) => {
    setCurrentTab(newTab);
  };

  return {
    TABS: TAB_EDIT_PRODUCT,
    currentTab,
    handleTabChange,
  };
};
