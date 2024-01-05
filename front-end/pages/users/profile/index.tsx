import Header from "@/components/header";
import EditProfileForm from "@/components/users/EditProfileForm";
import UserService from "@/services/UserService";
import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const UserProfile: React.FC = () => {

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [authError, setAuthError] = useState<string>("");

    const getUserById = async () => {
        setErrorMessage("");
        setAuthError("");
        const id = sessionStorage.getItem('loggedUser');
        if (!id) { setAuthError("You must be logged in to view this page."); return; }

        const response = await UserService.getById(id);
        if (!response.ok) {
            if (response.status === 401) {
                setAuthError("You are not authorized to view this page.");
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


    if (error) return <>Failed to load</>
    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>
            <div className="bg-gray-100 min-h-screen">
            <Header />
            <main>
                {errorMessage || authError ?
                    <p>{errorMessage || authError}</p> :
                    data ?
                        <>
                            <h1 className='bg-gray-100 text-center font-semibold text-3xl'>Profile</h1>
                            {<EditProfileForm user={data} />}
                        </>
                        :
                        <p>Loading...</p>
                }
            </main>
            </div>
        </>
    )

}

export default UserProfile;
