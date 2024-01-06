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

const {data, isLoading, error} = useSWR('projectsFromDb', fetchProjects);


useInterval(() => {
    mutate('projectsFromDb', fetchProjects());

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
            {data && (<ProjectOverviewTable projects={data} />) }
        </section>
        <section>
            {data && <AddProject />}
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
