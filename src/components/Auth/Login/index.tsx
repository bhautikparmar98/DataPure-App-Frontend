// react
import { capitalCase } from 'change-case';
// next
import NextLink from 'next/link';

import {
  Box,
  Container,
  Link,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import Image from 'src/components/Shared/Image';
// components
import Page from 'src/components/Shared/Page';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// guards
import GuestGuard from 'src/guards/GuestGuard';
// components
// styling
import Logo from 'src/components/Shared/Logo';
import { PATH_AUTH } from 'src/routes/auth/paths';
import useLoginLogic from './hooks/useLoginLogic';
import LoginForm from './LoginForm';
import { ContentStyle, HeaderStyle, RootStyle, SectionStyle } from './styles';

const Login = () => {
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');

  const { method, submitHandler } = useLoginLogic();

  // hee
  return (
    <GuestGuard>
      <Page title="Login">
        <RootStyle>
          <HeaderStyle>
            <Logo />
            {smUp && (
              <Typography variant="body2" sx={{ mt: { md: -2 } }}>
                Don’t have an account?{' '}
                <NextLink href={PATH_AUTH.login} passHref>
                  <Link variant="subtitle2">Connect with us</Link>
                </NextLink>
              </Typography>
            )}
          </HeaderStyle>

          {mdUp && (
            <SectionStyle>
              <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                Hi, Welcome Back
              </Typography>
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Bossa_Nova_Robotics_logo.svg"
                alt="login"
                sx={{ mx: 2 }}
              />
            </SectionStyle>
          )}

          <Container maxWidth="sm">
            <ContentStyle>
              <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" gutterBottom>
                    Sign in to DataPure
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Enter your details below.
                  </Typography>
                </Box>

                <Tooltip title={capitalCase(method)} placement="right">
                  <>
                    <Image
                      disabledEffect
                      alt={method}
                      src={`/images/logo.png`}
                      sx={{ width: 32, height: 32 }}
                    />
                  </>
                </Tooltip>
              </Stack>

              <LoginForm onSubmit={submitHandler} />

              {!smUp && (
                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                  Don’t have an account?{' '}
                  <NextLink href={PATH_AUTH.register} passHref>
                    <Link variant="subtitle2">Get started</Link>
                  </NextLink>
                </Typography>
              )}
            </ContentStyle>
          </Container>
        </RootStyle>
      </Page>
    </GuestGuard>
  );
};

export default Login;
