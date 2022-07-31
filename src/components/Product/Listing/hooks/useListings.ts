// helpers
import { applySortFilter, getComparator } from '../helpers';
// hooks
import { useEffect, useState } from 'react';
import { useDispatch } from 'src/redux/store';
import { getProducts } from 'src/redux/slices/product';
// _mock_
import { _listings } from 'src/_mock';

const useListings = () => {
  const dispatch = useDispatch();

  const [productList, setProductList] = useState<any>([]);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [selected, setSelected] = useState<string[]>([]);

  const [filterName, setFilterName] = useState('');

  const [orderBy, setOrderBy] = useState('createdAt');

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (_listings.length) {
      setProductList(_listings);
    }

    //Add dependencies when not using mocked products
  }, []);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const selected = productList.map((n: any) => n.name);
      setSelected(selected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleDeleteProducts = (selected: string[]) => {
    const deleteProducts = productList.filter((product: any) => !selected.includes(product.name));
    setSelected([]);
    setProductList(deleteProducts);
  };

  const filteredProducts = applySortFilter(productList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredProducts.length && Boolean(filterName);

  return {
    order,
    setOrder,
    orderBy,
    setOrderBy,
    filterName,
    handleFilterByName,
    handleDeleteProducts,
    productList,
    selected,
    handleRequestSort,
    handleSelectAllClick,
    filteredProducts,
    handleClick,
    isNotFound,
  };
};

export default useListings;
