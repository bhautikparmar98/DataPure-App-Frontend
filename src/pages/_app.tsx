// i18n
import '../locales/i18n';
// highlight
import 'src/utils/highlight';

// scroll bar
import 'simplebar/src/simplebar.css';

// lightbox
import 'react-image-lightbox/style.css';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// editor
import 'react-quill/dist/quill.snow.css';

// slick-carousel
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';

// fullcalendar
import '@fullcalendar/common/main.min.css';
import '@fullcalendar/daygrid/main.min.css';

import cookie from 'cookie';
import { ReactElement, ReactNode } from 'react';
// next
import { NextPage } from 'next';
import Head from 'next/head';
//
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// @mui
// redux
import { Provider as ReduxProvider } from 'react-redux';
import { store } from 'src/redux/store';

// utils
import { SettingsValueProps } from 'src/components/Shared/settings/type';
import { getSettings } from 'src/utils/settings';
// contexts
import { CollapseDrawerProvider } from 'src/contexts/CollapseDrawerContext';
import { SettingsProvider } from 'src/contexts/SettingsContext';
// theme
import ThemeProvider from 'src/theme';
// components
import MotionLazyContainer from 'src/components/Shared/animate/MotionLazyContainer';
import { ChartStyle } from 'src/components/Shared/chart';
import NotistackProvider from 'src/components/Shared/NotistackProvider';
import ProgressBar from 'src/components/Shared/ProgressBar';
import RtlLayout from 'src/components/Shared/RtlLayout';
import Settings from 'src/components/Shared/settings';
import ThemeColorPresets from 'src/components/Shared/ThemeColorPresets';

import App, { AppContext, AppProps } from 'next/app';
import { AuthProvider } from 'src/contexts/JWTContext';
import { AxiosInterceptor } from 'src/utils/axios';

// ----------------------------------------------------------------------

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  settings: SettingsValueProps;
  Component: NextPageWithLayout;
}

export default function MyApp(props: MyAppProps) {
  const { Component, pageProps, settings } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <AuthProvider>
        <AxiosInterceptor>
          <ReduxProvider store={store}>
            <CollapseDrawerProvider>
              <SettingsProvider defaultSettings={settings}>
                <ThemeProvider>
                  <NotistackProvider>
                    <MotionLazyContainer>
                      <ThemeColorPresets>
                        <RtlLayout>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <ChartStyle />
                            {/* <Settings /> */}
                            <ProgressBar />
                            {getLayout(<Component {...pageProps} />)}
                          </LocalizationProvider>
                        </RtlLayout>
                      </ThemeColorPresets>
                    </MotionLazyContainer>
                  </NotistackProvider>
                </ThemeProvider>
              </SettingsProvider>
            </CollapseDrawerProvider>
          </ReduxProvider>
        </AxiosInterceptor>
      </AuthProvider>
    </>
  );
}

// --------------------------------page load settings--------------------------------------

MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context);

  const cookies = cookie.parse(
    context.ctx.req ? context.ctx.req.headers.cookie || '' : document.cookie
  );

  const settings = getSettings(cookies);

  return {
    ...appProps,
    settings,
  };
};
