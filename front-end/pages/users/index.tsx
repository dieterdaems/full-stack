import UsersOverviewTable from "@/components/users/UsersOverviewTable";
import UserService from "@/services/UserService";
import Head from "next/head";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";


const Users: React.FC = () => {

    const getAllUsers = async () => {
        const response = await UserService.getAll();
        return response.json();
    }

    const { data, error } = useSWR('allUsers', getAllUsers);

    useInterval(() => {
        mutate('allUsers', getAllUsers());
    }, 1000);

    if (error) return <>Failed to load</>
    if (!data) return <>Loading...</>
    return (
        <>
            <Head>
                <title>Users</title>
            </Head>
            <main>
                <h1>Users</h1>
                <section>
                    {<UsersOverviewTable users={data}/>}
                </section>
            </main>
        </>
    );
}

export default Users;
