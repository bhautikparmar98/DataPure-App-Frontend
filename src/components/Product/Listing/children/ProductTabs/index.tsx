// mui
import { TabContext, TabList } from '@mui/lab';
import { Tab } from '@mui/material';
// styles
import { TabsStyle } from './styles';
// types
import { ProductTabsProps } from './interfaces';
// components
import { Block } from 'src/sections/overview/Block';
// hooks
import useResponsive from 'src/hooks/useResponsive';

const ProductTabs = ({ TABS, currentTab, handleTabChange }: ProductTabsProps) => {
  const isDesktop = useResponsive('up', 'lg');
  return (
    <TabsStyle className={!isDesktop ? 'small-screen' : ''}>
      <Block className="tabs-wrapper">
        <TabContext value={currentTab}>
          <TabList
            TabIndicatorProps={{
              style: {
                width: '30px',
              },
            }}
            onChange={handleTabChange}
          >
            {TABS.map((tab: any) => (
              <Tab key={tab.key} label={tab.label} value={tab.value} disabled={false} />
            ))}
          </TabList>
        </TabContext>
      </Block>
    </TabsStyle>
  );
};

export default ProductTabs;
