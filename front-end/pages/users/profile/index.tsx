import Header from "@/components/header";
import EditProfileForm from "@/components/users/EditProfileForm";
import UserService from "@/services/UserService";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import { useTranslation } from "next-i18next";

const UserProfile: React.FC = () => {

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [authError, setAuthError] = useState<string>("");

    const { t } = useTranslation();
    const getUserById = async () => {
        setErrorMessage("");
        setAuthError("");
        const id = sessionStorage.getItem('loggedUser');
        if (!id) { setAuthError(t('notLoggedIn')); return; }

        const response = await UserService.getById(id);
        if (!response.ok) {
            if (response.status === 401) {
                setAuthError(t('notAuthorized'));
            }
            else setErrorMessage(response.statusText);

        }
        else {
            return response.json();
        }
    }

    const { data, error } = useSWR('userById', getUserById);

    useInterval(() => {
        if (!authError) mutate('userById', getUserById());
    }, 1000);


    if (error) return <>{t('generalError')}</>
    return (
        <>
            <Head>
                <title>{t('users.profile.title')}</title>
            </Head>
            <div className="bg-gray-100 min-h-screen">
            <Header />
            <main>
                {errorMessage || authError ?
                    <p>{errorMessage || authError}</p> :
                    data ?
                        <>
                            <h1 className='bg-gray-100 text-center font-semibold text-3xl'>{t('users.profile.title')}</h1>
                            {<EditProfileForm user={data} />}
                        </>
                        :
                        <p>{t('users.profile.loading')}</p>
                }
            </main>
            </div>
        </>
    )

}

export const getServerSideProps: GetServerSideProps = async (context) =>{
    const { locale } = context;
    return {
    props: {
      ...(await serverSideTranslations(locale ?? "en" ,["common"])),
    },
  }
}

export default UserProfile;
