import TaskService from "@/services/TaskService";
import { Task } from "@/types";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { error } from "console";

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

    const handleDeleteButton = async (id: any) => {
        setTaskToDelete(String(id));
        setShowConfirmation(true);
    };

    const handleDeleteConfirm = async () => {
        const response = await TaskService.deleteById(taskToDelete);
        const data = await response.json();
        if (response.ok) {
            setStatusMessage("Deleted task successfully!");
        }
        else {
            setStatusMessage(data.errorMessage);
        }
        setShowConfirmation(false);
    };

    const handleDeleteCancel = () => {
        setShowConfirmation(false);
    }

    if (tasks.length == 0 ) return <>
    <p>{t('tasks.noTasks')}</p>
    <button onClick={() => router.push('/tasks/register/' + projectId)}>{t('tasks.new')}</button>
    </>
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
                        <td>{task.completed ? <>{t('tasks.completed')}</> : <button onClick={async () => await TaskService.completeTask(task.id)}>{t('tasks.complete')}</button>}</td>
                        <td><button onClick={() => handleDeleteButton(task.id)}>{t('tasks.delete')}</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
            <button onClick={() => router.push('/tasks/register/' + projectId)}>{t('tasks.new')}</button>
            {showConfirmation && (
                            <>
                                <p>{t('tasks.confirmation')}</p>
                                <button onClick={handleDeleteConfirm}>{t('confirm')}</button>
                                <button onClick={handleDeleteCancel}>{t('cancel')}</button>
                            </>
                        )}
            <p>{statusMessage}</p>
        </>
    );
};

export default TasksOverviewTable;
