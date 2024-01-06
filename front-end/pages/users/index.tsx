import Header from "@/components/header";
import UsersOverviewTable from "@/components/users/UsersOverviewTable";
import UserService from "@/services/UserService";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from 'next-i18next';

import Head from "next/head";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";


const Users: React.FC = () => {

    const [statusMessage, setStatusMessage] = useState<string>("");
    const [authError, setAuthError] = useState<string>("");

    const { t } = useTranslation();
    const getAllUsers = async () => {
        setStatusMessage("");
        setAuthError("");
        
        const response = await UserService.getAll();
        if (!response.ok) {
            if (response.status === 401) {
                setAuthError(t('notAuthorized'));
            }
            else setStatusMessage(response.statusText);
        }
        else {
            return response.json();
        }
    }

    const { data, error } = useSWR('allUsers', getAllUsers);

    useInterval(() => {
        if (!authError) mutate('allUsers', getAllUsers());
    }, 1000);

    if (error) return <>{t('generalError')}</>
    return (
        <>
            <Head>
                <title>{t('users.overview.title')}</title>
            </Head>
            <div className="bg-gray-100 min-h-screen">
            <Header />
            <main>
                <p>{authError}</p>
                <p>{statusMessage}</p>
                {data && (
                    <>
                        <h1 className='bg-gray-100 text-center font-semibold text-3xl'>{t('users.overview.title')}</h1>
                        <section>
                            {<UsersOverviewTable users={data} />}
                        </section>
                    </>
                )}
                {!data && !statusMessage && !authError && <p>{t('users.overview.loading')}</p>}
            </main>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) =>{
    const { locale } = context;
    return {
    props: {
      ...(await serverSideTranslations(locale ?? "en" ,["common"])),
    },
  }
}
export default Users;
