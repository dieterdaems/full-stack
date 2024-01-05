import Header from "@/components/header";
import UserLoginForm from "@/components/users/UserLoginForm";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


const UserLogin: React.FC = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(true);

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
                <title>Login</title>
            </Head>
            <div className="bg-gray-100 min-h-screen">
            <Header />
            <main>
                {!loading && (
                    <>
                        <h1 className='bg-gray-100 text-center font-semibold text-3xl'>Login</h1>
                        <section>
                            {<UserLoginForm />}
                        </section>
                    </>
                )}
            </main>
            </div>
        </>
    )
}

export default UserLogin;
