import TasksOverviewTable from "@/components/tasks/TasksProjectOverviewTable";
import TaskService from "@/services/TaskService";
import UserService from "@/services/UserService";
import { Task } from "@/types";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const Tasks: React.FC = () => {

    const [statusMessage, setStatusMessage] = useState<string>("");
    

    const fetchTasks = async () => {
        setStatusMessage("")
        const auth = await UserService.getAuth();
        if(auth) {
        const response = await TaskService.getAll();
        const tasks = await response.json();
        // if(user.role == "admin") {
        return tasks;
        }
        else {
            setStatusMessage("You are not logged in!");
           return
        }
    // }
    // else {
        //still to modify
        // return tasks.filter(task => task.project.team.id == user.team.id);
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
                {statusMessage && <p>{statusMessage}</p>}
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