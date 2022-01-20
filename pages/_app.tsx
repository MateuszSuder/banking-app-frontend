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
import NewAccountForm from "../components/Forms/NewAccountForm";

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
    fetch('/api/account/info')
      .then(res => {
        if(res.ok)
          return res.json()
        else throw res.json()
      })
      .then(data => {
        store.user.setAccounts(data);
        store.util.noAccountModal = !Boolean(data.length)
      })
      .catch(e => {
        location.replace('/api/auth/login')
      })
  }, [])

  return (
    <StateProvider>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
            { store.util.modal && <SimpleModal body={<p>{store.util.modal}</p>} open={true} closable={true} onClose={() => store.util.modal = null} />}
            { store.util.createMultiModal && <SimpleModal closable={false} open={true} body={<NewAccountForm type='multi' onSuccess={() => location.replace('/api/auth/login')}/>}/>}
          </Layout>
        </ThemeProvider>
      </UserProvider>
    </StateProvider>
  )
})
export default MyApp
