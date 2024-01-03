import Header from "@/components/header";
import TeamsOverviewTable from "@/components/teams/TeamsOverviewTable";
import TeamService from "@/services/TeamService";
import UserService from "@/services/UserService";
import Head from "next/head";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const Teams: React.FC = () => {

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [authError, setAuthError] = useState<string>("");
    const [statusMessage, setStatusMessage] = useState<string>("");

    const getAllTeams = async () => {
        setErrorMessage("");
        setAuthError("");
        const response = await TeamService.getAll();
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
    const getUserTeams = async () => {
        setStatusMessage("")
        if (await UserService.getAuth()) {
        const id = sessionStorage.getItem("loggedUser");
        const response = await UserService.getById(id);
        if (!response.ok) {
            if (response.status === 401) {
                setAuthError("You are not authorized to view this page.");
            }
            else setErrorMessage(response.statusText);
        }
        else {
            const user = await response.json();
            return user.teams;
        }
    };
}


    const { data: currentTeamsData, error: currentTeamsError } = useSWR('currentTeams', getUserTeams);
    const { data, error } = useSWR('allTeams', getAllTeams);

    useInterval(() => {
        if (!authError) {
            mutate('allTeams', getAllTeams());
            mutate('currentTeams', getUserTeams());
        }
    }, 1000);


    if (error || currentTeamsError) return <>Failed to load</>
    return (
        <>
            <Head>
                <title>Teams</title>
            </Head>
            <Header />
            <main>
                <p>{errorMessage}</p>
                <p>{authError}</p>
                {data && currentTeamsData && (
                    <>
                        <h1>Teams</h1>
                        {<TeamsOverviewTable teams={data} currentTeams={currentTeamsData} />}
                    </>
                )}
                {!data && !errorMessage && !authError && <p>Loading...</p>}
            </main>
        </>
    )
};

export default Teams;