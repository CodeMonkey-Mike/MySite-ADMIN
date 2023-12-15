import React from 'react';
import { ApolloProvider } from '@apollo/client';
import App, { AppContext, AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { theme } from 'src/theme';
import { GlobalStyle } from 'src/styled/global.style';
import { AuthProvider } from 'src/contexts/auth/auth.provider';
import PrivateRoute from './routes';
import { useApollo } from 'src/helper/apollo';
import { Home } from 'src/containers';
import 'antd/dist/antd.css';
import '@uiw/react-textarea-code-editor/dist.css';

export default function NextApp({ Component, pageProps, router }: AppProps) {
  const client = useApollo(pageProps.initialApolloState);
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AuthProvider>
          {router.pathname.includes('login') ? (
            <Component {...pageProps} />
          ) : (
            <PrivateRoute>
              <Home>
                <Component {...pageProps} />
              </Home>
            </PrivateRoute>
          )}
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

NextApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const { query } = appContext.ctx;
  return { ...appProps, query };
};
