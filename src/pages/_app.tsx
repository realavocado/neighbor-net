import MainNavbar from "@/components/MainNavbar";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { AppProps } from "next/app";
import { SSRProvider } from "react-bootstrap";
import AuthContext, { AuthProvider } from "@/context/AuthContext";
import 'firebase/firestore';
import 'firebase/auth';
import { FuegoProvider } from '@nandorojo/swr-firestore';
import { Fuego } from '@/feugo';


const lightTheme = createTheme({
  type: "light",
});

const darkTheme = createTheme({
  type: "dark",
});


import '@/styles/globals.css'

const firebaseConfig = {
  apiKey: "AIzaSyCfYc8koO2k2n5bWZf1vbLHD5hnAnahrX4",
  authDomain: "neighbornet-64b3f.firebaseapp.com",
  projectId: "neighbornet-64b3f",
  storageBucket: "neighbornet-64b3f.appspot.com",
  messagingSenderId: "682067984065",
  appId: "1:682067984065:web:c8552099da349f0f059e40",
}

export const fuego = new Fuego(firebaseConfig);
export const auth = fuego.auth();
export const db = fuego.db


export default function App({ Component, pageProps }: AppProps) {


  return (
    <SSRProvider>
      <NextThemesProvider
        defaultTheme="system"
        attribute="class"
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}
      >
        <NextUIProvider>
          <AuthProvider>
            <FuegoProvider fuego={fuego}>
              <MainNavbar></MainNavbar>
              <Component {...pageProps} />
            </FuegoProvider>
            <Analytics />
          </AuthProvider>
        </NextUIProvider>
      </NextThemesProvider>
    </SSRProvider>
  );
}

