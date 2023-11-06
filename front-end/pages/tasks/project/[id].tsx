import TasksOverviewTable from "@/components/tasks/TasksProjectOverviewTable";
import TaskService from "@/services/TaskService";
import { Task } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>();
    const router = useRouter();
    const { id } = router.query;

    const getTaskByProjectId = async () => {
        const response = await TaskService.getByProjectId(id as string);
        const tasks = await response.json();
        setTasks(tasks);
    }

    useEffect(() => {
        getTaskByProjectId();
    }
        , []);

    return (
        <>
            <main>
                <h1>Tasks</h1>
                <section>
                    {tasks && (<TasksOverviewTable tasks={tasks} />) || (<p>Loading...</p>)}
                </section>
                <button onClick={() => router.push('/projects/')}>Return to project overview</button>
            </main>


        </>

    )

};

export default Tasks;