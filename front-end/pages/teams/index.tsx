import Header from "@/components/header";
import AddTeamForm from "@/components/teams/AddTeamForm";
import TeamsOverviewTable from "@/components/teams/TeamsOverviewTable";
import TeamService from "@/services/TeamService";
import UserService from "@/services/UserService";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const Teams: React.FC = () => {

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [authError, setAuthError] = useState<string>("");

    const { t } = useTranslation();
    const getAllTeams = async () => {
        setErrorMessage("");
        setAuthError("");
        const response = await TeamService.getAll();
        if (!response.ok) {
            if (response.status === 401) {
                setAuthError(t('notAuthorized'));
            }
            else setErrorMessage(response.statusText);
        }
        else {
            return response.json();
        }
    }
    const getUserTeams = async () => {
        const id = sessionStorage.getItem("loggedUser");
        const response = await UserService.getById(id);
        if (!response.ok) {
            if (response.status === 401) {
                setAuthError(t('notAuthorized'));
            }
            else setErrorMessage(response.statusText);
        }
        else {
            const user = await response.json();
            return user.teams;
        }
    };

    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const router = useRouter();
    useEffect(() => {
        const role = (sessionStorage.getItem('role'));
        if (role === '91fb3f8394dead2470aaf953e1bed9d9abf34a41f65ac666cff414ca229245b8') {
            setIsAdmin(true);
        }
        else setIsAdmin(false);
    }, [router]);


    const { data: currentTeamsData, error: currentTeamsError } = useSWR('currentTeams', getUserTeams);
    const { data, error } = useSWR('allTeams', getAllTeams);

    useInterval(() => {
        if (!authError) {
            mutate('allTeams', getAllTeams());
            mutate('currentTeams', getUserTeams());
        }
    }, 1000);


    if (error || currentTeamsError) return <>{t('generalError')}</>
    return (
        <>
            <Head>
                <title>{t('teams.title')}</title>
            </Head>
            <div className="bg-gray-100 min-h-screen">
            <Header />
            <main>
                <p>{errorMessage}</p>
                <p>{authError}</p>
                {data && currentTeamsData && (
                    <>
                        <h1 className='bg-gray-100 text-center font-semibold text-3xl'>{t('teams.title')}</h1>
                        {<TeamsOverviewTable teams={data} currentTeams={currentTeamsData} isAdmin={isAdmin} />}
                        {isAdmin && <AddTeamForm />}
                    </>
                )}
                {!data && !errorMessage && !authError && <p>{t('teams.loading')}</p>}
            </main>
            </div>
        </>
    )
};

export const getServerSideProps: GetServerSideProps = async (context) =>{
    const { locale } = context;
    return {
    props: {
      ...(await serverSideTranslations(locale ?? "en" ,["common"])),
    },
  }
}


export default Teams;