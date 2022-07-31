import Iconify from 'src/components/Shared/Iconify';

export const HEAD_LABELS = [
  { id: '#', label: '#', alignRight: false },
  { id: 'name', label: 'Product Name', alignRight: false },
  { id: 'sku', label: 'SKU', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'price', label: 'Price', alignRight: false },
  {
    id: 'expand',
    label: (
      <Iconify
        icon={'flat-color-icons:expand'}
        sx={{
          cursor: 'pointer',
          '& path': { fill: '#688BB1' },
        }}
      />
    ),
    alignRight: false,
  },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'edit', label: 'Edit', alignRight: true },
];
