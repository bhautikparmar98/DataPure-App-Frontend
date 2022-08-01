import { sentenceCase } from 'change-case';
import { useState } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Table,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from 'src/routes/dashboard/paths';
// hooks
import useSettings from 'src/hooks/useSettings';
// @types
import { UserManager } from 'src/@types/user';
// _mock_
// layouts
import Layout from 'src/layouts';
// components
import Page from 'src/components/Shared/Page';
import Label from 'src/components/Shared/Label';
import Iconify from 'src/components/Shared/Iconify';
import Scrollbar from 'src/components/Shared/Scrollbar';
import SearchNotFound from 'src/components/Shared/SearchNotFound';
import HeaderBreadcrumbs from 'src/components/Shared/HeaderBreadcrumbs';
// sections
import useUserListLogic from './useUserListLogic';
import UserListTableHeader from './Body/UserListTableHeader';
import UserListHeader from './Header';
import UserMoreMenu from './Body/UserMoreMenu';
import UserListTableToolbar from './Body/UserListTableToolbar';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

const UserListComponent = () => {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const {
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
  } = useUserListLogic();

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <UserListHeader />

      <Card>
        <UserListTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDeleteUsers={() => handleDeleteMultiUser(selected)}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListTableHeader
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={userList.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const {
                      id,
                      name,
                      role,
                      status,
                      company,
                      avatarUrl,
                      isVerified,
                    } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            onClick={() => handleClick(name)}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ display: 'flex', alignItems: 'center' }}
                        >
                          <Avatar alt={name} src={avatarUrl} sx={{ mr: 2 }} />
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{company}</TableCell>
                        <TableCell align="left">{role}</TableCell>
                        <TableCell align="left">
                          {isVerified ? 'Yes' : 'No'}
                        </TableCell>
                        <TableCell align="left">
                          <Label
                            variant={
                              theme.palette.mode === 'light'
                                ? 'ghost'
                                : 'filled'
                            }
                            color={
                              (status === 'banned' && 'error') || 'success'
                            }
                          >
                            {sentenceCase(status)}
                          </Label>
                        </TableCell>

                        <TableCell align="right">
                          <UserMoreMenu
                            onDelete={() => handleDeleteUser(id)}
                            userName={name}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {isNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={userList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, page) => setPage(page)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
};

export default UserListComponent;

