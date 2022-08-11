import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import axiosInstance from 'src/utils/axios';
import { IImage } from '../../DataSet/types';

const useDatasetReview = ({ projectId }: { projectId: string }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [imageList, setImageList] = useState<IImage[]>([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [selected, setSelected] = useState<string[]>([]);

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [orderBy, setOrderBy] = useState('createdAt');
  const [isDense, setIsDense] = useState(false);

  useEffect(() => {
    const getProjectImages = async () => {
      if (!projectId)
        return enqueueSnackbar('Invalid Project', { variant: 'error' });

      try {
        setLoading(true);

        const response = await axiosInstance.get(
          `/project/${projectId}/images`
        );
        const { images } = response.data;

        setImageList(images);
      } catch (error) {
        console.log('error', error);
        enqueueSnackbar('Something went wrong', { variant: 'error' });
      }
      setLoading(false);
    };

    getProjectImages();
  }, [projectId]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const selected = imageList.map((n) => n._id!);
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

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleDeleteImage = (imageId: string) => {
    // TODO: handle this in
    const updatedImages = imageList.filter((img) => img._id !== imageId);
    setSelected([]);
    setImageList(updatedImages);
  };

  const handleDeleteImages = (selected: string[]) => {
    const updatedProducts = imageList.filter(
      (img) => !selected.includes(img._id!)
    );
    setSelected([]);
    setImageList(updatedProducts);
  };

  const denseToggleHandler = () => {
    setIsDense((prev) => !prev);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - imageList.length) : 0;

  const filteredImages = applySortFilter(
    imageList,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredImages.length && Boolean(filterName);

  return {
    imageList,
    loading,
    page,
    order,
    selected,
    filterName,
    rowsPerPage,
    orderBy,
    handleRequestSort,
    handleSelectAllClick,
    handleClick,
    handleChangeRowsPerPage,
    handleFilterByName,
    handleDeleteImage,
    handleDeleteImages,
    emptyRows,
    isNotFound,
    filteredImages,
    setPage,
    isDense,
    denseToggleHandler,
  };
};

export default useDatasetReview;

// ----------------------------------------------------------------------

function descendingComparator(a: Anonymous, b: Anonymous, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Anonymous = Record<string | number, string>;

function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: Anonymous, b: Anonymous) => descendingComparator(a, b, orderBy)
    : (a: Anonymous, b: Anonymous) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(
  array: IImage[],
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
      (_product) =>
        _product.fileName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return stabilizedThis.map((el) => el[0]);
}
