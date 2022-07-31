import { useState } from 'react';

//constants
import { TAB_LISTING } from 'src/constants/tabs';

const useListingsTabs = () => {
  const [currentTab, setCurrentTab] = useState('listings');
  const handleTabChange = (e: React.SyntheticEvent, newTab: string) => {
    setCurrentTab(newTab);
  };

  return {
    TABS: TAB_LISTING,
    currentTab,
    handleTabChange,
  };
};

export default useListingsTabs;
