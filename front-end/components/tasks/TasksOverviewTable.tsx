import { Task } from "@/types";

type Props = {
    tasks: Task[] | undefined;
};


const TasksOverviewTable: React.FC<Props> = ({ tasks }: Props) => {
    return (
        <>
        <table>
            <thead>
                <tr>
                    <th>Naam</th>
                    <th>Description</th>
                    <th>Deadline</th>
                    <th>Project</th>
                </tr>
            </thead>
            <tbody>
                {tasks && tasks.map((task, index) => (
                    <tr key={index}>
                        <td>{task.name}</td>
                        <td>{task.description}</td>
                        <td>{task.deadline.toString()}</td>
                        <td>{task.project.name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        
        </>
    );
};

export default TasksOverviewTable;
