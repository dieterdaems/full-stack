import TeamsOverviewTable from "@/components/teams/TeamsOverviewTable";
import TeamService from "@/services/TeamService";
import UserService from "@/services/UserService";
import Head from "next/head";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const Teams: React.FC = () => {

    const [errorMessage, setErrorMessage] = useState<string>("");

    const getAllTeams = async () => {
        const response = await TeamService.getAll();
        const data = await response.json();
        if (!response.ok) {
            if (response.status === 401) {
                setErrorMessage("You are not authorized to view this page.");
            }
            else setErrorMessage(data.errorMessage);
        }
        else {
            return data;
        }
    }
    const getUserTeams = async () => {
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
            return user.teams;
        }
    };


    const { data: currentTeamsData, error: currentTeamsError } = useSWR('currentTeams', getUserTeams);
    const { data, error } = useSWR('allTeams', getAllTeams);

    useInterval(() => {
        if (!errorMessage) {
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
            <main>
                <p>{errorMessage}</p>
                {data && currentTeamsData && (
                    <>
                        <h1>Teams</h1>
                        {<TeamsOverviewTable teams={data} currentTeams={currentTeamsData} />}
                    </>
                )}
                {!data && !errorMessage && <p>Loading...</p>}
            </main>
        </>
    )
};

export default Teams;