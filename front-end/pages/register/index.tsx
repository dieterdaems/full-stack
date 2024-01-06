import Header from "@/components/header";
import UserRegistrationForm from "@/components/users/UserRegistrationForm";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


const UserRegistration: React.FC = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const { t } = useTranslation();
    
    // Redirect to homepage if the user is already logged in
    useEffect(() => {
        // Check if the JWT token is present in sessionStorage
        const token = sessionStorage.getItem('token');

        // If the token is present, redirect the user to another page
        if (token) {
            router.push('/');
        }
        else {
            // If the token is not present, set loading to false to render the content
            setLoading(false);
        }
    }, [router]);

    return (
        <>
            <Head>
                <title>{t('users.register.title')}</title>
            </Head>
            <div className="bg-gray-100 min-h-screen">
            <Header />
            <main>
                {!loading && (
                    <>
                        <h1 className='bg-gray-100 text-center font-semibold text-3xl'>{t('users.register.title')}</h1>
                        <section>
                            {<UserRegistrationForm />}
                        </section>
                    </>
                )}
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

export default UserRegistration;
