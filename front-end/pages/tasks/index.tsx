import TasksOverviewTable from "@/components/tasks/TasksOverviewTable";
import TaskService from "@/services/TaskService";
import { Task } from "@/types";
import { useEffect, useState } from "react";

const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>();

    const fetchTasks = async () => {
        const response = await TaskService.getAll();
        const tasks = await response.json();
        setTasks(tasks);
    }

    useEffect(() => {
        fetchTasks();
    }, []);


    return (
        <>
        <main>
            <h1>Tasks</h1>
            <section>
                {tasks && (<TasksOverviewTable tasks={tasks} />) || (<p>Loading...</p>)}
            </section>
        </main>
        
        
        </>

    )
    
};

export default Tasks;