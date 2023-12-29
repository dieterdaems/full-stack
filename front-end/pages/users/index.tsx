import UsersOverviewTable from "@/components/users/UsersOverviewTable";
import UserService from "@/services/UserService";
import Head from "next/head";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";


const Users: React.FC = () => {

    const [statusMessage, setStatusMessage] = useState<string>("");

    const getAllUsers = async () => {
        setStatusMessage("");
        const response = await UserService.getAll();
        const users = await response.json();
        if (!response.ok) {
            if (response.status === 401) {
                setStatusMessage("You are not authorized to view this page.");
            }
            else setStatusMessage(users.errorMessage);
        }
        else {
            return users;
        }
    }

    const { data, error } = useSWR('allUsers', getAllUsers);

    useInterval(() => {
        if (data) mutate('allUsers', getAllUsers());
    }, 1000);

    if (error) return <>Failed to load</>
    return (
        <>
            <Head>
                <title>Users</title>
            </Head>
            <main>
                <p>{statusMessage}</p>
                {data && (
                    <>
                        <h1>Users</h1>
                        <section>
                            {<UsersOverviewTable users={data} />}
                        </section>
                    </>
                )}
                {!data && !statusMessage && <p>Loading...</p>}
            </main>
        </>
    );
}

export default Users;
