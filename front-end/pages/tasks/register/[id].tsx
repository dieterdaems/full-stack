import TaskRegistrationForm from "@/components/tasks/TaskRegistration";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";



const Tasks: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const projectId = typeof id === 'string' ? parseInt(id) : undefined;

    return (
        <>
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