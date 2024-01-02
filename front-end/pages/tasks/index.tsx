import Header from "@/components/header";
import TasksOverviewTable from "@/components/tasks/TasksProjectOverviewTable";
import TaskService from "@/services/TaskService";
import UserService from "@/services/UserService";
import { Task } from "@/types";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const Tasks: React.FC = () => {

    const [statusMessage, setStatusMessage] = useState<string>("");
    const { t } = useTranslation();
    

    const fetchTasks = async () => {
        setStatusMessage("")
        const auth = await UserService.getAuth();

        if(auth) {
        const role = sessionStorage.getItem("role");

            if (role == "admin") {
            const response = await TaskService.getAll();
            const tasks = await response.json();
            return tasks;
            }

            else {
                const id = sessionStorage.getItem("loggedUser");
                if (!id) return;
                const response = await TaskService.getTaskByUserId(id)
                const tasks = await response.json();
                return tasks;
            }
        }

        else {
            const reply = t('notLoggedIn')
            setStatusMessage(reply);
           return
        }
    }

    const {data, isLoading, error} = useSWR('getTasks', fetchTasks);

    useInterval(() => {
        mutate('getTasks', fetchTasks());
    }, 1000);


    return (
        <>
            <Head>
                <title>{t('app.title')}</title>
            </Head>
            <Header />
            <main>
                <h1>{t('tasks.title')}</h1>
                {statusMessage && <p>{statusMessage}</p>}
                {error && <p>{error}</p>}
                {isLoading && <p>{t('tasks.loading')}</p>}
                <section>
                    {data && (<TasksOverviewTable tasks={data} />)}
                </section>
            </main>


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

export default Tasks;