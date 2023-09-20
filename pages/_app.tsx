import { SessionProvider } from "next-auth/react";
import "../app/globals.css";
import type { AppProps } from "next/app";
import { Session } from "inspector";
import { Component } from "react";
import Head from "next/head";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
