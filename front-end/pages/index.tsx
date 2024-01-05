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
            <div className="bg-gray-100 min-h-screen">
            <Header />
            <main className='flex flex-col text-center'>
                <h2 className=' mb-4 mt-4'>
                    {t('main.welcome')}
                </h2>
                <p>
                    {t('main.description')}
                </p>
            </main>
            </div>
        </>
    )
};

export const getServerSideProps: GetServerSideProps = async (context) =>{
    const { locale } = context;
    return {
    props: {
      ...(await serverSideTranslations(locale ?? "en" ,["common"])),
    },
  }
}
export default Welcome;