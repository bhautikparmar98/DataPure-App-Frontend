import { Class } from 'src/constants';
import { useEffect, useState } from 'react';
import { useAppSelector } from 'src/redux/store';

type SortType = 'a-z' | 'newest' | 'oldest';

const useSortedClasses = () => {
  // classes management
  const { classes } = useAppSelector(({ classes }) => classes);
  const [sortedClasses, setSortedClasses] = useState<Class[]>([]);

  //using this primitive string value to rerender classes list
  const [lastSortType, setLastSortType] = useState<SortType>('newest');

  useEffect(() => {
    setSortedClasses(classes);
  }, [classes]);

  const sortClassesByName = () => {
    const classesInOrder = classes.sort((a, b) => a.name.localeCompare(b.name));
    setSortedClasses(classesInOrder);
  };

  const sortBy = (sortType: SortType) => {
    //sorting by date needs to be dependant on `createdAt` flag in database
    if (sortType === 'newest') setSortedClasses(classes);
    else if (sortType === 'oldest') setSortedClasses(classes.reverse());
    else if (sortType === 'a-z') sortClassesByName();

    if (sortType !== lastSortType) setLastSortType(sortType);
  };

  return {
    sortBy,
    sortedClasses,
    lastSortType,
  };
};

export default useSortedClasses;
