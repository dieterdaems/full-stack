import EditProfileForm from "@/components/users/EditProfileForm";
import UserService from "@/services/UserService";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const UserProfile: React.FC = () => {

    const router = useRouter();
    const { id } = router.query;

    const getUserById = async () => {
        if (id) {
            const response = await UserService.getById(parseInt(id as string));
            return response.json();
        } 
        else return null;
    }

    const { data, error } = useSWR('userById', getUserById);


    useInterval(() => {
        mutate('userById', getUserById());
    }, 1000);


    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>
            <main>
                {error && <p>Failed to load</p>}
                {!data ? (<p>Loading...</p>)
                    :
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
