// ----------------------------------------------------------------------

export type Product = {
  id: string;
  image: string;
  name: string;
  price: number;
  sku: string;
  colors: string[];
  status: 'Listed' | 'Delisted' | 'Draft' | 'Submitted';
  date: Date | string | number;
};
