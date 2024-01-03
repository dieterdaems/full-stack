import Header from "@/components/header";
import UserRegistrationForm from "@/components/users/UserRegistrationForm";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


const UserRegistration: React.FC = () => {

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
                <title>Registration</title>
            </Head>
            <Header />
            <main>
                {!loading && (
                    <>
                        <h1>User Registration</h1>
                        <section>
                            {<UserRegistrationForm />}
                        </section>
                    </>
                )}
            </main>

        </>

    )

}

export default UserRegistration;
