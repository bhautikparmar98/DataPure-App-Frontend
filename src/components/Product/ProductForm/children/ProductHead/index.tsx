// @mui
import useResponsive from 'src/hooks/useResponsive';
//interface
import { EditProductHeadProps } from '../../interfaces';

import { Box, Typography, Breadcrumbs as MBreadcrumbs, Link, Badge, Grid } from '@mui/material';

// components
import Avatar from 'src/components/Shared/Avatar';
import BadgeStatus from 'src/components/Shared/BadgeStatus';
import BlockVariant from '../BlockVariant';

// ----------------------------------------------------------------------
const ProductHead: React.FC<EditProductHeadProps> = ({ productImages }) => {
  const isDesktop = useResponsive('up', 'lg');
  return (
    <Grid>
      <Grid>
        <BlockVariant
          key={'h5'}
          font={{ variant: 'h5', label: 'One More Step To List New Product!' }}
        />
        <MBreadcrumbs
          sx={{
            '& > *': { mt: 4 },
          }}
        >
          <Link color="inherit" href="#">
            My Listings
          </Link>
          <Link color="inherit" href="#">
            List New Product
          </Link>
          <Link color="inherit" href="#">
            Add images
          </Link>
          <Typography sx={{ color: 'text.primary' }}>Add details</Typography>
        </MBreadcrumbs>
      </Grid>
      <Grid
        sx={{
          display: 'flex',
          '& > *': { mr: 4, mt: 4, mb: 4 },
        }}
      >
        {['busy', 'busy', 'busy', 'busy', 'busy', 'busy'].map((status, index) => (
          <Box key={status} sx={{ position: 'relative' }}>
            <Avatar
              alt="Travis Howard"
              src={`/static/product/listing_images/${index + 1}.svg`}
              sx={{ width: 56, height: 56 }}
            />
            <BadgeStatus status={status} sx={{ right: 2, top: 2, position: 'absolute' }} />
          </Box>
        ))}
      </Grid>
      <Grid>
        <BlockVariant
          key={'h5'}
          font={{ variant: 'h5', label: 'Step 2: Describe the product' }}
        />
      </Grid>
    </Grid>
  );
};

export default ProductHead;