import TeamsOverviewTabel from "@/components/teams/TeamsOverviewTabel";
import TeamService from "@/services/TeamService";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const Teams: React.FC = () => {

    const router = useRouter();
    const { id } = router.query;

    const getAllTeams = async () => {
        const response = await TeamService.getAll();
        return response.json();
    }

    const { data, error } = useSWR('allTeams', getAllTeams);

    useInterval(() => {
        mutate('allTeams', getAllTeams());
    }, 1000);

    
    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>
    return (
        <>
            <Head>
                <title>Teams</title>
            </Head>
            <main>
                <h1>Teams</h1>
                {<TeamsOverviewTabel teams={data} id={parseInt(id as string)}/>}
            </main>
        </>
    )
};

export default Teams;