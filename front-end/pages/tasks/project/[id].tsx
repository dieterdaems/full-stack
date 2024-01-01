import TasksOverviewTable from "@/components/tasks/TasksProjectOverviewTable";
import TaskService from "@/services/TaskService";
import { Task } from "@/types";
import exp from "constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import Header from "@/components/header";

const Tasks: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const { t } = useTranslation();

    const getTaskByProjectId = async () => {
        const response = await TaskService.getByProjectId(id as string);
        const tasks = await response.json();
        // console.log("test");
        return tasks;
    }

    // useEffect(() => {
    //     getTaskByProjectId();
    // }
    //     , []);
    
    const {data, isLoading, error} = useSWR('tasksByProjectId', getTaskByProjectId);

    useInterval(() => {
        mutate('tasksByProjectId',getTaskByProjectId());
    }, 1000);

    console.log('Translations:', t('tasks.title'));

    return (
        <>
            <Head>
                <title>{t('app.title')}</title>
            </Head>
            <Header />
            <main>
                <h1>{t('tasks.title')}</h1>
                {error && <p>{error}</p>}
                {isLoading && <p>{t('tasks.loading')}</p>}
                <section>
                    {data && (<TasksOverviewTable tasks={data} />)}
                </section>
                <button onClick={() => router.push('/projects/')}>{t('tasks.return')}</button>
            </main>


        </>

    )

};

export const getServerSideProps: GetServerSideProps = async ({locale}) =>({
    props: {
      ...(await serverSideTranslations(locale ?? "en" ,["common"])),
    },
  })

export default Tasks;