import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {UserProvider, useUser} from "@auth0/nextjs-auth0";
import React, {ReactElement, useEffect} from 'react';
import {StateProvider} from "../store/Context";
import {createTheme, ThemeProvider} from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import Layout from "../components/layout";

const theme = createTheme({
  palette: {
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#82b1ff',
    }
  }
});

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <StateProvider>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </UserProvider>
    </StateProvider>
  )
}
export default MyApp
