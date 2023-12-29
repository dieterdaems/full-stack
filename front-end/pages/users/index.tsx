import UsersOverviewTable from "@/components/users/UsersOverviewTable";
import UserService from "@/services/UserService";
import Head from "next/head";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";


const Users: React.FC = () => {

    const [statusMessage, setStatusMessage] = useState<string>("");


    const getAllUsers = async () => {
        setStatusMessage("")
        if (await auth()) {
        const response = await UserService.getAll();
        return response.json();
        }
        else {
            setStatusMessage("You are not logged in!");
            return
        }
    }

    const auth = async () => {
        const response = await UserService.getAuth();
        return response;
    }

    const { data, isLoading, error } = useSWR('allUsers', getAllUsers);

    useInterval(() => {
        mutate('allUsers', getAllUsers());
    }, 1000);

    // if (error) return <>Failed to load</>
    // if (!data) return <>Loading...</>
    return (
        <>
            <Head>
                <title>Users</title>
            </Head>
            <main>
                <h1>Users</h1>
                {statusMessage && <p>{statusMessage}</p>}
                {error && <p>{error}</p>}
                {isLoading && <p>Loading...</p>}
                <section>
                    {data && <UsersOverviewTable users={data}/>}
                </section>
            </main>
        </>
    );
}

export default Users;
