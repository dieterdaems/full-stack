import EditProfileForm from "@/components/users/EditProfileForm";
import UserService from "@/services/UserService";
import Head from "next/head";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const UserProfile: React.FC = () => {

    const [errorMessage, setErrorMessage] = useState<string>("");

    const getUserById = async () => {
        setErrorMessage("");
        const id = sessionStorage.getItem("loggedUser");
        if (!id) return;

        const response = await UserService.getById(parseInt(id));
        const user = await response.json();
        if (!response.ok) {
            if (response.status === 401) {
                setErrorMessage("You are not authorized to view this page.");
            }
            else setErrorMessage(user.errorMessage);

        }
        else {
            return user;
        }
    }

    const { data, error } = useSWR('userById', getUserById);

    useInterval(() => {
        if (!errorMessage) mutate('userById', getUserById());
    }, 1000);


    if (error) return <>Failed to load</>
    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>
            <main>
                {
                    errorMessage ?
                        <p>{errorMessage}</p> :
                        !data ?
                            <p>Loading...</p> :
                            <>
                                <h1>Profile</h1>
                                {<EditProfileForm user={data} />}
                            </>
                }
            </main>
        </>
    )

}

export default UserProfile;
