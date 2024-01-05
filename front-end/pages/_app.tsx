
import { appWithTranslation, i18n, useTranslation } from "next-i18next"
import { AppProps } from "next/app"
import { use, useEffect } from "react";
import '@/styles/globals.css'

const App = ({ Component, pageProps }: AppProps) => {
    // const { i18n } = useTranslation();
    return <Component {...pageProps} />
}

export default appWithTranslation(App);