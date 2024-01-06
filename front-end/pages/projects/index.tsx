import AddProject from "@/components/projects/AddProject";
import ProjectOverviewTable from "@/components/projects/ProjectsOverviewTable";
import ProjectService from "@/services/ProjectService";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import UserService from "@/services/UserService";
import Header from "@/components/header";
import Head from "next/head";

const Projects: React.FC = () => {

    const [statusMessage, setStatusMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [authError, setAuthError] = useState<string>("");

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


return (
    <>
    <Head>
                <title>{t('app.title')}</title>
    </Head>
    <div className="bg-gray-100 min-h-screen">
    <Header />
    <main>
        <h1 className='bg-gray-100 text-center font-semibold text-3xl'>{t('projects.title')}</h1>
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
