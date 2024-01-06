import Header from "@/components/header";
import TaskRegistrationForm from "@/components/tasks/TaskRegistration";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";



const Tasks: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const projectId = typeof id === 'string' ? parseInt(id) : undefined;
    const { t } = useTranslation();

    return (
        <>
        <Head>
                <title>{t('tasks.register')}</title>
            </Head>
            <div className="bg-gray-100 min-h-screen">
            <Header />
        <main>
            <h1 className='bg-gray-100 text-center font-semibold text-3xl'>{t('tasks.register')}</h1>
            <section>
            {projectId && <TaskRegistrationForm projectId={projectId} />}
            </section>
            <div className="bg-gray-100 flex items-center justify-center">
                <button className="global-button" onClick={() => router.push('/tasks/project/'+id)}>{t('tasks.returnToTasks')}</button>
                </div>
        </main>
        </div>
        
        </>

    )
    
}

export const getServerSideProps: GetServerSideProps = async ({locale}) =>({
    props: {
      ...(await serverSideTranslations(locale ?? "en" ,["common"])),
    },
  })

export default Tasks;