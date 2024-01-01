import Header from "@/components/header";
import TaskRegistrationForm from "@/components/tasks/TaskRegistration";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";



const Tasks: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const projectId = typeof id === 'string' ? parseInt(id) : undefined;

    return (
        <>
        <Head>
                <title>Tasks</title>
            </Head>
            <Header />
        <main>
            <h1>Tasks Registration</h1>
            <section>
            {projectId !== undefined && <TaskRegistrationForm projectId={projectId} />}
            </section>
        </main>
        
        
        </>

    )
    
}

export default Tasks;