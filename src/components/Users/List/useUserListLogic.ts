import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { UserManager } from 'src/@types/user';
import axiosInstance from 'src/utils/axios';

const useUserListLogic = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [userList, setUserList] = useState<any[]>([]);
  const [usersTotalCount, setUsersTotalCount] = useState(0);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = userList.map((n) => n.name);
      setSelected(newSelecteds);
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

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteUser = (userId: string) => {
    const deleteUser = userList.filter((user) => user.id !== userId);
    setSelected([]);
    setUserList(deleteUser);
  };

  const handleDeleteMultiUser = (selected: string[]) => {
    const deleteUsers = userList.filter(
      (user) => !selected.includes(user.name)
    );
    setSelected([]);
    setUserList(deleteUsers);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(
    userList,
    getComparator(order, orderBy),
    filterName
  );

  const addUserHandler = (user: any) => {
    setUserList((prev) => [...prev, { ...user }]);
    setUsersTotalCount((prev) => prev + 1);
  };

  const isNotFound = !filteredUsers.length && Boolean(filterName);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get('/user', {
          params: { skip: page * rowsPerPage, take: rowsPerPage },
        });

        const { users, totalCount } = response.data;
        setUserList(users);
        setUsersTotalCount(totalCount);
      } catch (error) {
        console.log('error', error);
        enqueueSnackbar('Something went wrong.', { variant: 'error' });
      }
      setLoading(false);
    };

    getAllUsers();
  }, [page, rowsPerPage]);

  return {
    handleRequestSort,
    handleSelectAllClick,
    handleClick,
    handleChangeRowsPerPage,
    handleFilterByName,
    handleDeleteUser,
    handleDeleteMultiUser,
    emptyRows,
    isNotFound,
    userList,
    page,
    order,
    selected,
    orderBy,
    filterName,
    rowsPerPage,
    filteredUsers,
    setPage,
    usersTotalCount,
    loading,
    addUserHandler,
  };
};

export default useUserListLogic;

// ----------------------------------------------------------------------

type Anonymous = Record<string | number, string>;

function descendingComparator(a: Anonymous, b: Anonymous, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: Anonymous, b: Anonymous) => descendingComparator(a, b, orderBy)
    : (a: Anonymous, b: Anonymous) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(
  array: UserManager[],
  comparator: (a: any, b: any) => number,
  query: string
) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter(
      (_user) =>
        `${_user.firstName} ${_user.lastName}`
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}
