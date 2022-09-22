import "../styles/globals.css";

import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider as AuthProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { SWRConfig } from "swr";

import { AuthModalWrapper } from "@/context/AuthModalContext";

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <>
      <AuthProvider session={session}>
        <AuthModalWrapper>
          <SWRConfig
            value={{
              revalidateIfStale: false,
              revalidateOnFocus: false,
              revalidateOnReconnect: false,
            }}
          >
            <Component {...pageProps} />
          </SWRConfig>
        </AuthModalWrapper>
      </AuthProvider>
      <Toaster />
    </>
  );
}

export default MyApp;
