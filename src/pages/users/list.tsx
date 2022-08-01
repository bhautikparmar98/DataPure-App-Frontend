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
import UserListComponent, {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from 'src/components/Users/List';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

UserList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserList() {
  return (
    <Page title="User List">
      <UserListComponent />
    </Page>
  );
}

