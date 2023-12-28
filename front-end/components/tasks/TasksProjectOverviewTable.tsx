import TaskService from "@/services/TaskService";
import { Task } from "@/types";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

type Props = {
    tasks: Task[];
};


const TasksOverviewTable: React.FC<Props> = ({ tasks }: Props) => {
    const router = useRouter();
    const { t } = useTranslation();

    const projectId = router.query.id;

    const deleteTask = async (id: any) => {
        await TaskService.deleteById(id.toString());
        // router.push('/tasks');
    }

    const completebutton = (task: Task) => {
        if (task.completed) {
            return <>{t('tasks.completed')}</>
        } else {
            return <button onClick={() => TaskService.completeTask(task)}>{t('tasks.complete')}</button>
        }
    }
    return (
        <>
        <table>
            <thead>
                <tr>
                    <th>{t('tasks.name')}</th>
                    <th>{t("tasks.description")}</th>
                    <th>{t('tasks.deadline')}</th>
                    <th>{t('tasks.project')}</th>
                    <th>{t('tasks.completed')}</th>
                    <th>{t('tasks.delete')}</th>
                </tr>
            </thead>
            <tbody>
                {tasks && tasks.map((task, index) => (
                    <tr key={index}>
                        <td>{task.name}</td>
                        <td>{task.description}</td>
                        <td>{task.deadline.toString().slice(0, 10)}</td>
                        <td>{task.project.name}</td>
                        <td>{completebutton(task)}</td>

                        <td><button onClick={() => deleteTask(task.id)}>{t('tasks.completed')}</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
            <button onClick={() => router.push('/tasks/register/' + projectId)}>{t('tasks.new')}</button>
        
        </>
    );
};

export default TasksOverviewTable;
