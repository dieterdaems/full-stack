import TaskService from "@/services/TaskService";
import { Task } from "@/types";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useState } from "react";

type Props = {
    tasks: Task[];
};


const TasksOverviewTable: React.FC<Props> = ({ tasks }: Props) => {

    const [statusMessage, setStatusMessage] = useState<string>("");
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [taskToDelete, setTaskToDelete] = useState<any>();

    const router = useRouter();
    const { t } = useTranslation();

    const projectId = router.query.id;

    const deleteTask = async (id: any) => {
        await TaskService.deleteById(id.toString());
        // router.push('/tasks');
    }

    const completebutton = async (id: any) => {
        const response = await TaskService.completeTask(id);
    }
    return (
        <>
        <table>
            <thead>
                <tr>
                    <th>{t('tasks.name')}</th>
                    <th>{t("tasks.description")}</th>
                    <th>{t('tasks.deadline')}</th>
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
                        <td>{task.completed ? <>{t('tasks.completed')}</> : <button onClick={() => completebutton(task.id)}>{t('tasks.complete')}</button>}</td>
                        <td><button onClick={() => deleteTask(task.id)}>{t('tasks.delete')}</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
            <button onClick={() => router.push('/tasks/register/' + projectId)}>{t('tasks.new')}</button>
            {/* {showConfirmation && (
                            <>
                                <p>Are you sure you want to delete this user?</p>
                                <button onClick={handleDeleteConfirm}>Confirm</button>
                                <button onClick={handleDeleteCancel}>Cancel</button>
                            </>
                        )}
            <p>{statusMessage}</p> */}
        </>
    );
};

export default TasksOverviewTable;
