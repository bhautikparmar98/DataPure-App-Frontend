// @mui
import { Container, Typography, Drawer, Link } from '@mui/material';
import useResponsive from 'src/hooks/useResponsive';
// next
import NextLink from 'next/link';
// routes
import { PATH_AUTH } from 'src/routes/auth/paths';
// components
import Page from 'src/components/Shared/Page';
import Logo from 'src/components/Shared/Logo';
// sections
import RegisterForm from './RegisterForm';
// style
import { RootStyle, ContentStyle } from './styles/index.style';
//hooks
import useRegisterLogic from './hooks/useRegisterLogic';

// ----------------------------------------------------------------------

const Register: React.FC = () => {
  const isDesktop = useResponsive('up', 'lg');

  const { submitHandler } = useRegisterLogic();

  return (
    <Page title="Sign Up">
      <RootStyle>
        <Container>
          <ContentStyle>
            {isDesktop ? (
              <Drawer
                sx={{
                  width: 180,
                  flexShrink: 0,
                  '& .MuiDrawer-paper': {
                    width: 180,
                    border: '1px solid #E8F2FF',
                    boxSizing: 'border-box',
                  },
                }}
                variant="permanent"
                anchor="left"
                open={true}
              >
                <Logo sx={{ width: '60px', margin: '60px auto' }} />
              </Drawer>
            ) : (
              <Logo sx={{ width: '60px', margin: '0 auto', p: 0 }} />
            )}
            <Typography variant="h4" sx={{ mb: 3, mt: isDesktop ? 0 : '-60px' }}>
              Create a New Hammoq Account
            </Typography>

            <RegisterForm onSubmit={submitHandler} />
            <Typography variant="body2" align="center" sx={{ mt: 3 }} color="text.secondary">
              Already have account?{' '}
              <NextLink href={PATH_AUTH.login} passHref>
                <Link>Sign in</Link>
              </NextLink>
            </Typography>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
};

export default Register;
