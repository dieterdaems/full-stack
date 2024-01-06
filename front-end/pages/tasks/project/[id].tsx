import TasksOverviewTable from "@/components/tasks/TasksProjectOverviewTable";
import TaskService from "@/services/TaskService";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Header from "@/components/header";
import { useState } from "react";

const Tasks: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState("");
    const [authError, setAuthError] = useState("");

    const getTasksByProjectId = async () => {
        setErrorMessage("");
        setAuthError("");
        const response = await TaskService.getByProjectId(id as string);
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

    
    const {data, isLoading, error} = useSWR('tasksByProjectId', getTasksByProjectId);

    useInterval(() => {
        mutate('tasksByProjectId',getTasksByProjectId());
    }, 1000);

    console.log('Translations:', t('tasks.title'));

    return (
        <>
            <Head>
                <title>{t('app.title')}</title>
            </Head>
            <div className="bg-gray-100 min-h-screen">
            <Header />
            <main>
                <h1 className='bg-gray-100 text-center font-semibold text-3xl'>{t('tasks.title')}</h1>
                <p>{errorMessage}</p>
                <p>{authError}</p>
                {error && <p>{error}</p>}
                {isLoading && <p>{t('tasks.loading')}</p>}
                <section>
                    {data && (<TasksOverviewTable tasks={data} />)}
                </section>
                <div className="bg-gray-100 flex items-center justify-center">
                <button className="global-button" onClick={() => router.push('/projects/')}>{t('tasks.return')}</button>
                </div>
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

export default Tasks;