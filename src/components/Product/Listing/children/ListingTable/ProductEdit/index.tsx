import { paramCase } from 'change-case';
// next
import NextLink from 'next/link';
// routes
import { PATH_DASHBOARD } from 'src/routes/client/paths';
// components
import Iconify from 'src/components/Shared/Iconify';
import { ProductEditProps } from './interfaces';
// ----------------------------------------------------------------------

export default function ProductEdit({ onDelete, productName }: ProductEditProps) {
  return (
    <NextLink href={`${PATH_DASHBOARD.general.listings}/product/edit/${paramCase(productName)}`}>
      <a>
        <Iconify
          icon="akar-icons:pencil"
          sx={{
            width: 13,
            height: 13,
            cursor: 'pointer',
            color: 'text.secondary',
          }}
        />
      </a>
    </NextLink>
  );
}
