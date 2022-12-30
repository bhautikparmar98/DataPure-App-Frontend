import isString from 'lodash/isString';
import { ReactNode } from 'react';
// @mui
import { Box, Typography, Link, IconButton } from '@mui/material';
//
import Breadcrumbs, { Props as BreadcrumbsProps } from './Breadcrumbs';
import Iconify from './Iconify';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

interface Props extends BreadcrumbsProps {
  action?: ReactNode;
  heading: string;
  moreLink?: string | string[];
}

export default function HeaderBreadcrumbs({
  links,
  action,
  heading,
  moreLink = '' || [],
  sx,
  ...other
}: Props) {
  const router = useRouter()
  return (
    <Box sx={{ mb: 5, ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{display:'flex'}}>
            <IconButton sx={{pb:0}} onClick={()=>{router.push('/project')}}>
              <Iconify icon="material-symbols:arrow-back-ios-new-rounded">
              </Iconify>
            </IconButton>
            <Typography sx={{mt:2}} variant="h4" gutterBottom>
              {heading}
            </Typography>
          </Box>
          <Breadcrumbs links={links} {...other} />
        </Box>

        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Box>

      <Box sx={{ mt: 2 }}>
        {isString(moreLink) ? (
          <Link href={moreLink} target="_blank" variant="body2">
            {moreLink}
          </Link>
        ) : (
          moreLink.map((href) => (
            <Link
              noWrap
              key={href}
              href={href}
              variant="body2"
              target="_blank"
              sx={{ display: 'table' }}
            >
              {href}
            </Link>
          ))
        )}
      </Box>
    </Box>
  );
}
