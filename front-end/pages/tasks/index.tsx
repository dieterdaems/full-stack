import TasksOverviewTable from "@/components/tasks/TasksProjectOverviewTable";
import TaskService from "@/services/TaskService";
import { Task } from "@/types";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const Tasks: React.FC = () => {
    

    const fetchTasks = async () => {
        const response = await TaskService.getAll();
        const tasks = await response.json();
        return tasks;
    }

    // useEffect(() => {
    //     fetchTasks();
    // }, []);

    const {data, isLoading, error} = useSWR('getTasks', fetchTasks);

    useInterval(() => {
        mutate('getTasks', fetchTasks());
    }, 1000);


    return (
        <>
            <main>
                <h1>Tasks</h1>
                {error && <p>{error}</p>}
                {isLoading && <p>Loading...</p>}
                <section>
                    {data && (<TasksOverviewTable tasks={data} />)}
                </section>
            </main>


        </>

    )

};

export default Tasks;