import TeamsOverviewTable from "@/components/teams/TeamsOverviewTable";
import TeamService from "@/services/TeamService";
import UserService from "@/services/UserService";
import Head from "next/head";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const Teams: React.FC = () => {

    const getAllTeams = async () => {
        const response = await TeamService.getAll();
        return response.json();
    }

    const getUserTeams = async () => {
        const id = sessionStorage.getItem("loggedUser");
        if (!id) return;

        const response = await UserService.getById(parseInt(id));
        const user = await response.json();
        return user.teams;
    }

    const { data: currentTeamsData, error: currentTeamsError } = useSWR('currentTeams', getUserTeams);
    const { data, error } = useSWR('allTeams', getAllTeams);

    useInterval(() => {
        mutate('allTeams', getAllTeams());
        mutate('currentTeams', getUserTeams());
    }, 1000);

    
    if (error || currentTeamsError) return <>Failed to load</>
    if (!data || !currentTeamsData) return <>Loading...</>
    return (
        <>
            <Head>
                <title>Teams</title>
            </Head>
            <main>
                <h1>Teams</h1>
                {<TeamsOverviewTable teams={data} currentTeams={currentTeamsData}/>}
            </main>
        </>
    )
};

export default Teams;