import UserRegistrationForm from "@/components/users/UserRegistrationForm";
import Head from "next/head";


const Users: React.FC = () => {
    return (
        <>
            <Head>
                <title>Registration</title>
            </Head>
            <main>
                <h1>User Registration</h1>
                <section>
                    {<UserRegistrationForm />}
                </section>
            </main>

        </>

    )

}

export default Users;
