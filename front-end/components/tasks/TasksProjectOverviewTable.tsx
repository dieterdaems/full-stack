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

    const completebutton = (task: Task) => {
        if (task.completed) {
            return <>{t('tasks.completed')}</>
        } else {
            return <button onClick={() => TaskService.completeTask(task)}>{t('tasks.complete')}</button>
        }
    }
    return (
        <>
        <div className="bg-gray-100 flex items-start justify-center">

        <div className="container mx-auto my-8" >
        <table className="mx-auto bg-white border border-gray-300">
            <thead>
                <tr>
                    <th className="py-2 px-4 border-b border-r">{t('tasks.name')}</th>
                    <th className="py-2 px-4 border-b border-r">{t("tasks.description")}</th>
                    <th className="py-2 px-4 border-b border-r">{t('tasks.deadline')}</th>
                    <th className="py-2 px-4 border-b border-r">{t('tasks.project')}</th>
                    <th className="py-2 px-4 border-b border-r">{t('tasks.completed')}</th>
                    <th className="py-2 px-4 border-b border-r">{t('tasks.delete')}</th>
                </tr>
            </thead>
            <tbody>
                {tasks && tasks.map((task, index) => (
                    <tr key={index}>
                        <td className="py-2 px-4 border-b text-center border-r">{task.name}</td>
                        <td className="py-2 px-4 border-b text-center border-r">{task.description}</td>
                        <td className="py-2 px-4 border-b text-center border-r">{task.deadline.toString().slice(0, 10)}</td>
                        <td className="py-2 px-4 border-b text-center border-r">{task.project.name}</td>
                        <td className="py-2 px-4 border-b text-center border-r">{completebutton(task)}</td>

                        <td><button className="global-button" onClick={() => handleDeleteButton(task.id)}>{t('tasks.completed')}</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
            <button onClick={() => router.push('/tasks/register/' + projectId)}>{t('tasks.new')}</button>
            {showConfirmation && (
                            <>
                                <p>{t('tasks.confirmation')}</p>
                                <button className="global-button" onClick={handleDeleteConfirm}>{t('confirm')}</button>
                                <button className="global-button" onClick={handleDeleteCancel}>{t('cancel')}</button>
                            </>
                        )}
            <p>{statusMessage}</p>
        </div>
        </div>
        </>
    );
};

export default TasksOverviewTable;
