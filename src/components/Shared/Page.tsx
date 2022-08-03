import Head from 'next/head';
import { forwardRef, ReactNode } from 'react';
// @mui
import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)(({ theme }) => ({
  background: theme.palette.gradients.secondary,
}));

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  children: ReactNode;
  meta?: ReactNode;
  title: string;
}

const Page = forwardRef<HTMLDivElement, Props>(
  ({ children, title = '', meta, ...other }, ref) => (
    <>
      <Head>
        <title>{`${title} | DatePure`}</title>
        {/* {meta} */}
      </Head>
      <StyledBox ref={ref} {...other}>
        {children}
      </StyledBox>
    </>
  )
);

export default Page;
