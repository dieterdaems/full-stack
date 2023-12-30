import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Header from '@/components/header';
import Head from 'next/head';

const Welcome: React.FC = () => {
    const { t } = useTranslation();
    return (
        <>
            <Head>
                <title>{t('app.title')}</title>
            </Head>
            <Header />
            <main>
                <h2>{t('main.welcome')}</h2>
                <p>{t('main.description')}</p>
            </main>
        </>
    )
};

export const getServerSideProps: GetServerSideProps = async ({locale}) =>({
    props: {
      ...(await serverSideTranslations(locale ?? 'en' ,["common"])),
    },
  })

export default Welcome;