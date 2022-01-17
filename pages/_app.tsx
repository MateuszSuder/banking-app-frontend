import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {UserProvider} from "@auth0/nextjs-auth0";
import React, { ReactElement } from 'react';
import {StateProvider} from "../store/Context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StateProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </StateProvider>
  )
}
export default MyApp
