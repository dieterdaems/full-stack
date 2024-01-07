import ProjectService from "@/services/ProjectService";
import { Project } from "@/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";

type Props = {
    projects: Project[];
};


const ProjectOverviewTable: React.FC<Props> = ({ projects }: Props) => {
    const [statusMessage, setStatusMessage] = useState<string>("");
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [projectToDelete, setProjectToDelete] = useState<any>();
    
    const router = useRouter();
    const { t } = useTranslation();
    
    const handleDeleteButton = async (id: any) => {
        setStatusMessage("");
        setProjectToDelete(String(id));
        setShowConfirmation(true);
    };

    const role = sessionStorage.getItem("role");

    const handleDeleteConfirm = async () => {
        const response = await ProjectService.deleteProject(projectToDelete);
        if (response.ok) {
            setStatusMessage(t('projects.deleted'));
        }
        else {
            setStatusMessage(t('projects.deleteFail'));
        }
        setTimeout(() => setStatusMessage(""), 2000);
        setShowConfirmation(false);
    };

    const handleDeleteCancel = () => {
        setShowConfirmation(false);
    }
    
    return (
        <>
        <div className="bg-gray-100 flex items-start justify-center">

        <div className="container mx-auto my-8" >

            <table className="mx-auto bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-r">{t('projects.id')}</th>
                        <th className="py-2 px-4 border-b border-r">{t('projects.name')}</th>
                        <th className="py-2 px-4 border-b border-r">{t('projects.team')}</th>
                        <th className="py-2 px-4 border-b">{t('tasks.title')}</th>
                        {role === "91fb3f8394dead2470aaf953e1bed9d9abf34a41f65ac666cff414ca229245b8" && <th className="py-2 px-4 border-b border-l">{t('projects.delete')}</th>}
                    </tr>
                </thead>
                <tbody>
                    {projects && projects.map((project, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 border-b text-center border-r">{project.id}</td>
                            <td className="py-2 px-4 border-b text-center border-r" >{project.name}</td>
                            <td className="py-2 px-4 border-b text-center border-r">{project.team?.name}</td>
                            <td className="py-2 px-4 border-b text-center"><button className="global-button"
                                    onClick={() => router.push('/tasks/project/' + project.id)}>{t('projects.tasks')}</button></td>
                            {role === "91fb3f8394dead2470aaf953e1bed9d9abf34a41f65ac666cff414ca229245b8" && <td className="py-2 px-4 border-b text-center border-l"><button className="global-button"
                                    onClick={() => handleDeleteButton(project.id)}>🗑️</button></td>}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="bg-gray-100 flex items-center justify-center">
            {showConfirmation && (
                            <>
                                <p>{t('projects.confirmation')}</p>
                                <button className="global-button"
                                onClick={handleDeleteConfirm}>{t('confirm')}</button>
                                <button className="global-button"
                                onClick={handleDeleteCancel}>{t('cancel')}</button>
                            </>
                        )}
            <p className=' text-red-600'>{statusMessage}</p>
            </div>
            </div>
        </div>
        </>
    );
};

export default ProjectOverviewTable;