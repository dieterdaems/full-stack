import AddProject from "@/components/projects/AddProject";
import ProjectOverviewTable from "@/components/projects/ProjectsOverviewTable";
import ProjectService from "@/services/ProjectService";
import { Project } from "@/types";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Head } from "next/document";
import { mainModule } from "process";
import { useEffect, useState, useDeferredValue } from "react";
import { useTranslation } from "next-i18next";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import UserService from "@/services/UserService";

const Projects: React.FC = () => {

    const [statusMessage, setStatusMessage] = useState<string>("");

    const {t} = useTranslation();
    const fetchProjects = async () => {
        setStatusMessage("")
        const auth = await UserService.getAuth();
        if(auth) {
            const response = await ProjectService.getAll();
            const projects = await response.json();
            // if(user.role == "admin") {
                return projects;
            }
        else {
            //TODO add translation
            setStatusMessage("You are not logged in!");
           return
        }
    // }
    // else {
        //still to modify
    //     return projects.filter(project => project.user.id == user.id);
    }

const {data, isLoading, error} = useSWR('projectsFromDb', fetchProjects);


useInterval(() => {
    mutate('projectsFromDb', fetchProjects());

}, 1000);


return (
    <>
    <main>
        <h1>{t('projects.title')}</h1>
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
    
    
    </>

)

    };

    export const getServerSideProps: GetServerSideProps = async ({locale}) =>({
        props: {
          ...(await serverSideTranslations(locale ?? "en" ,["common"])),
        },
      })

export default Projects;
