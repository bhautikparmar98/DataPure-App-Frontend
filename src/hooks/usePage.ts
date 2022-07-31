// hooks
import { useState } from 'react';

// TODO: change mvList type
function usePage(list: any) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - list.length) : 0;

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return { handleChangeRowsPerPage, page, setPage, emptyRows, rowsPerPage };
}

export default usePage;
