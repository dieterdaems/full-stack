import AddProject from "@/components/projects/AddProject";
import ProjectOverviewTable from "@/components/projects/ProjectsOverviewTable";
import ProjectService from "@/services/ProjectService";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import Header from "@/components/header";
import Head from "next/head";
import { useRouter } from "next/router";
import UserService from "@/services/UserService";
import TeamService from "@/services/TeamService";

const Projects: React.FC = () => {

    const [statusMessage, setStatusMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [authError, setAuthError] = useState<string>("");
    const [title, setTitle] = useState<string>("");

    const {t} = useTranslation();

    const fetchProjects = async () => {
        setStatusMessage("");
        setErrorMessage("");
        setAuthError("");
        const response = await ProjectService.getAll();
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
        if (!mayFetchTeams) return; // to prevent the unnecessary first call to getUserTeams() when the page is loaded
        const role = sessionStorage.getItem("role");
        // if the user is an admin, we need to fetch all teams. Otherwise, we only need to fetch the teams of the current user
        if (role === '91fb3f8394dead2470aaf953e1bed9d9abf34a41f65ac666cff414ca229245b8') {
            const response = await TeamService.getAll();
            if (!response.ok) { // I didn't check for 401 here because as long as you're logged in, you can see all teams.
                setErrorMessage(response.statusText);
                return;
            }
            else {
                const teams = await response.json();
                return teams;
            }
        }
        const id = sessionStorage.getItem("loggedUser");
        const response = await UserService.getById(id);
        if (!response.ok) {
            if (response.status === 401) {
                setAuthError(t('notAuthorizedAction'));
            }
            else setErrorMessage(response.statusText);
        }
        else {
            const user = await response.json();
            return user.teams;
        }
    };


    const { data: currentTeamsData, error: currentTeamsError } = useSWR('currentTeams', getUserTeams);
    const {data, isLoading, error} = useSWR('projectsFromDb', fetchProjects);


    useInterval(() => {
        mutate('projectsFromDb', fetchProjects());
        // Only fetch teams if add Project form is visible, to avoid unnecessary requests
        if (mayFetchTeams) {
            mutate('currentTeams', getUserTeams());
        }
    }, 1000);


    // Show different title depending on the role of the user
        const router = useRouter();
    useEffect(() => {
        const role = sessionStorage.getItem('role');
        // Reminder that roles are hashed in session storage for security reasons. Check UserLoginForm.tsx for more details.
        if (role === '91fb3f8394dead2470aaf953e1bed9d9abf34a41f65ac666cff414ca229245b8') {
            setTitle(t('projects.adminTitle'));
        }
        else setTitle(t('projects.userTitle'));

    }, [router]);

    // The way this works is that:
    // We pass the function handleShowAddProject to the component AddProject
    // Then:
        // when the user clicks on the "Add project" button in the component AddProject
        // or when the user clicks on the "Cancel" button in the component AddProject
        // or when the user clicks on the "Submit" button in the component AddProject AND validation passes in handleSubmit
    // Then:
        // the function below (handleShowAddProject) is called in the component Add project
        // and the state mayFetchTeams is updated to true or false, depending on the previous value.
    // This way, we can avoid unnecessary requests to the server when the addProject form is not even visible :)
    const [mayFetchTeams, setMayFetchTeams] = useState<boolean>(false);
    const handleShowAddProject = () => {
        setMayFetchTeams(!mayFetchTeams);
    }


return (
    <>
    <Head>
                <title>{t('projects.title')}</title>
    </Head>
    <div className="bg-gray-100 min-h-screen">
    <Header />
    <main>
        <h1 className='bg-gray-100 text-center font-semibold text-3xl'>{title}</h1>
        <p>{errorMessage}</p>
        <p>{authError}</p>
        {statusMessage && <p>{statusMessage}</p>}
        {error && <p>{error}</p>}
        {isLoading && <p>{t('projects.loading')}</p>}
        <section>
            {data && (<ProjectOverviewTable projects={data}/>) }
            {data && (<AddProject userTeams={currentTeamsData} handleShowAddProject={handleShowAddProject} />)}
        </section>
        <section>
        </section>
    </main>

    </div>
    
    
    </>

)

    };

    export const getServerSideProps: GetServerSideProps = async ({locale}) =>({
        props: {
          ...(await serverSideTranslations(locale ?? "en" ,["common"])),
        },
      })

export default Projects;
