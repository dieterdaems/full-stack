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

    const {t} = useTranslation();
    const fetchProjects = async () => {
        setStatusMessage("")
        const auth = await UserService.getAuth();
        if(auth) {
            const role = sessionStorage.getItem("role");
            if (role == "91fb3f8394dead2470aaf953e1bed9d9abf34a41f65ac666cff414ca229245b8") {
                const response = await ProjectService.getAll();
                const projects = await response.json();
                return projects;
            }
            else {
                const id = sessionStorage.getItem("loggedUser");
                if (!id) return;
                const reposnse = await ProjectService.getProjectsByUserId(id)
                const projects = await reposnse.json();
                return projects;
            }
        }
        else {
            const reply = t('notLoggedIn')
            setStatusMessage(reply);
           return
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
