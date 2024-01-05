import Header from "@/components/header";
import UsersOverviewTable from "@/components/users/UsersOverviewTable";
import UserService from "@/services/UserService";
import Head from "next/head";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";


const Users: React.FC = () => {

    const [statusMessage, setStatusMessage] = useState<string>("");
    const [authError, setAuthError] = useState<string>("");

    const getAllUsers = async () => {
        setStatusMessage("");
        setAuthError("");
        
        const response = await UserService.getAll();
        if (!response.ok) {
            if (response.status === 401) {
                setAuthError("You are not authorized to view this page.");
            }
            else setStatusMessage(response.statusText);
        }
        else {
            return response.json();
        }
    }

    const { data, isLoading, error } = useSWR('allUsers', getAllUsers);

    useInterval(() => {
        if (!authError) mutate('allUsers', getAllUsers());
    }, 1000);

    if (error) return <>Failed to load</>
    return (
        <>
            <Head>
                <title>Users</title>
            </Head>
            <div className="bg-gray-100 min-h-screen">
            <Header />
            <main>
                <p>{authError}</p>
                <p>{statusMessage}</p>
                {data && (
                    <>
                        <h1 className='bg-gray-100 text-center font-semibold text-3xl'>Users</h1>
                        <section>
                            {<UsersOverviewTable users={data} />}
                        </section>
                    </>
                )}
                {!data && !statusMessage && !authError && <p>Loading...</p>}
            </main>
            </div>
        </>
    );
}

export default Users;
