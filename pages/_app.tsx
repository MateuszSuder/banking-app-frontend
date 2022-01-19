import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {UserProvider, useUser} from "@auth0/nextjs-auth0";
import React, {ReactElement, useEffect, useState} from 'react';
import {StateProvider} from "../store/Context";
import {createTheme, ThemeProvider} from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import Layout from "../components/layout";
import {useRouter} from "next/dist/client/router";
import {useStore} from "../store/MainStore";
import SimpleModal from "../components/Modal/SimpleModal";
import {observer} from "mobx-react";

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

const MyApp = observer(({ Component, pageProps }: AppProps) => {
  const [noAccountModal, setNoAccountModal] = useState<boolean>(false);
  const store = useStore();

  useEffect(() => {
    console.log("TEST");
    fetch('/api/account/info')
      .then(res => {
        if(res.ok)
          return res.json()
        else throw res.json()
      })
      .then(data => {
        console.log(data);
        setNoAccountModal(!data.length);
        store.user.setAccounts(data);
      })
      .catch(e => {
        console.log(e);
        location.replace('/api/auth/login')
      })
  }, [])

  useEffect(() => {
    console.log(store.util.modal);
  }, [store.util.modal])

  return (
    <StateProvider>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
            { store.util.modal && <SimpleModal body={<p>{store.util.modal}</p>} open={true} closable={true} onClose={() => store.util.modal = null} />}
          </Layout>
        </ThemeProvider>
      </UserProvider>
    </StateProvider>
  )
})
export default MyApp
