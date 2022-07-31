// react
import { TabContext, TabList } from '@mui/lab';
import { Container, Link, Tab, Typography } from '@mui/material';
// next
import NextLink from 'next/link';
import Iconify from 'src/components/Shared/Iconify';
import Image from 'src/components/Shared/Image';
// components
import Page from 'src/components/Shared/Page';
// routes
import { PATH_AUTH } from 'src/routes/auth/paths';
//types
import { LoginProps } from './types';
// sections
import LoginForm from './LoginForm';
import { Block } from 'src/sections/overview/Block';
// styling
import { ContentStyle, RootStyle, style } from './styles';
import useLoginLogic from './hooks/useLoginLogic';
import { ROLES } from 'src/constants';

const SIMPLE_TAB = [
  {
    value: ROLES.CLIENT.value,
    icon: <Iconify icon="eva:person-outline" width={24} height={24} />,
    label: ROLES.CLIENT.label,
    disabled: false,
  },
];

const Login = ({ isAdminLogin }: LoginProps) => {
  const { handleTabChange, method, tabValue, submitHandler } = useLoginLogic({
    isAdminLogin,
  });

  // hee
  return (
    <Page title="Sign In">
      <RootStyle>
        <Container>
          <ContentStyle>
            <>
              <Image
                disabledEffect
                alt={method}
                src="/static/hm-logo.png"
                sx={{ width: 60, height: 30.35, margin: 'auto', mt: 10 }}
              />
            </>

            <Typography variant="h4" sx={{ textAlign: 'center', mt: 10 }}>
              Welcome!
            </Typography>

            {!isAdminLogin && (
              <Block sx={style}>
                <TabContext value={tabValue}>
                  <TabList onChange={handleTabChange}>
                    {SIMPLE_TAB.map((tab) => (
                      <Tab
                        key={tab.value}
                        icon={tab.icon}
                        label={tab.label}
                        value={tab.value}
                        disabled={tab.disabled}
                      />
                    ))}
                  </TabList>
                  {/*@todo  when register check value */}
                </TabContext>
              </Block>
            )}

            {/* Login form */}
            <LoginForm
              onSubmit={submitHandler}
              tab={tabValue}
              isAdminLogin={isAdminLogin || false}
            />

            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 10.625 }}
              color="text.secondary"
            >
              Don't have an account yet?{' '}
              <NextLink href={PATH_AUTH.register} passHref>
                <Link>Sign Up</Link>
              </NextLink>
            </Typography>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
};

export default Login;
