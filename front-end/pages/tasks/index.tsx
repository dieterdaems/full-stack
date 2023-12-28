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
        // if(user.role == "admin") {
        return tasks;
    // }
    // else {
        //still to modify
        // return tasks.filter(task => task.user.id == user.id);
    // }
    }

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