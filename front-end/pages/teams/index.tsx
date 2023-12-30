import Header from "@/components/header";
import TeamsOverviewTable from "@/components/teams/TeamsOverviewTable";
import TeamService from "@/services/TeamService";
import UserService from "@/services/UserService";
import Head from "next/head";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const Teams: React.FC = () => {

    const [statusMessage, setStatusMessage] = useState<string>("");


    const getAllTeams = async () => {
        setStatusMessage("")
        if (await auth()) {
        const response = await TeamService.getAll();
        return response.json();
        }
        else {
            setStatusMessage("You are not logged in!");
           return
        }
    }

    const getUserTeams = async () => {
        setStatusMessage("")
        if (await auth()) {
        const id = sessionStorage.getItem("loggedUser");
        if (!id) return;

        const response = await UserService.getById(parseInt(id));
        const user = await response.json();
        return user.teams;
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

    const { data: currentTeamsData, isLoading: isLoading2, error: currentTeamsError } = useSWR('currentTeams', getUserTeams);
    const { data, isLoading, error } = useSWR('allTeams', getAllTeams);

    useInterval(() => {
        mutate('allTeams', getAllTeams());
        mutate('currentTeams', getUserTeams());
    }, 1000);

    
    // if (error || currentTeamsError) return <>Failed to load</>
    // if (!data || !currentTeamsData) return <>Loading...</>
    return (
        <>
            <Head>
                <title>Teams</title>
            </Head>
            <Header />
            <main>
                <h1>Teams</h1>
                {statusMessage && <p>{statusMessage}</p>}
                {(error || currentTeamsError) && <p>{error}</p>}
                {(isLoading || isLoading2) && <p>Loading...</p>}
                {(data || currentTeamsData) && <TeamsOverviewTable teams={data} currentTeams={currentTeamsData}/>}
            </main>
        </>
    )
};

export default Teams;