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
            setStatusMessage("You are not logged in!");
           return
        }
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