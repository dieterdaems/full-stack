import TasksOverviewTable from "@/components/tasks/TasksProjectOverviewTable";
import TaskService from "@/services/TaskService";
import { Task } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const Tasks: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    const getTaskByProjectId = async () => {
        const response = await TaskService.getByProjectId(id as string);
        const tasks = await response.json();
        return tasks;
    }

    // useEffect(() => {
    //     getTaskByProjectId();
    // }
    //     , []);
    
    const {data, isLoading, error} = useSWR('tasksByProjectId', getTaskByProjectId);

    useInterval(() => {
        mutate('taskByProjectId',getTaskByProjectId);
    }, 5000);

    return (
        <>
            <main>
                <h1>Tasks</h1>
                {error && <p>{error}</p>}
                {isLoading && <p>Loading...</p>}
                <section>
                    {data && (<TasksOverviewTable tasks={data} />)}
                </section>
                <button onClick={() => router.push('/projects/')}>Return to project overview</button>
            </main>


        </>

    )

};

export default Tasks;