import TaskService from "@/services/TaskService";
import { Task } from "@/types";
import { useRouter } from "next/router";

type Props = {
    tasks: Task[];
};


const TasksOverviewTable: React.FC<Props> = ({ tasks }: Props) => {
    const router = useRouter();

    const deleteTask = async (id: any) => {
        await TaskService.deleteById(id.toString());
        // router.push('/tasks');
    }
    return (
        <>
        <table>
            <thead>
                <tr>
                    <th>Naam</th>
                    <th>Description</th>
                    <th>Deadline</th>
                    <th>Project</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {tasks && tasks.map((task, index) => (
                    <tr key={index}>
                        <td>{task.name}</td>
                        <td>{task.description}</td>
                        <td>{task.deadline.toString()}</td>
                        <td>{task.project.name}</td>
                        <td><button onClick={() => deleteTask(task.id)}>Delete</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
            <button onClick={() => router.push('/tasks/register/' + tasks[0].project.id)}>Add Task</button>
        
        </>
    );
};

export default TasksOverviewTable;
