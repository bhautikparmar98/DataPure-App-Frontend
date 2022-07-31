// _mock_
import { _mvList } from 'src/_mock';
import { useState } from 'react';

function usePage() {
  const [mvList, setMvList] = useState(_mvList);

  const handleDelete = (id: string) => {};

  return {
    handleDelete,
    mvList,
  };
}

export default usePage;
