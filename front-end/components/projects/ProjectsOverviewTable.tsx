import ProjectService from "@/services/ProjectService";
import { Project } from "@/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";

type Props = {
    projects: Project[] | undefined;
};


const ProjectOverviewTable: React.FC<Props> = ({ projects }: Props) => {
    const [statusMessage, setStatusMessage] = useState<string>("");
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [projectToDelete, setProjectToDelete] = useState<any>();
    
    const router = useRouter();
    const { t } = useTranslation();
    
    const handleDeleteButton = async (id: any) => {
        setProjectToDelete(String(id));
        setShowConfirmation(true);
    };

    const role = sessionStorage.getItem("role");

    const handleDeleteConfirm = async () => {
        const response = await ProjectService.deleteProject(projectToDelete);
        const data = await response.json();
        if (response.ok) {
            setStatusMessage("Deleted project successfully!");
        }
        else {
            setStatusMessage(data.errorMessage);
        }
        setShowConfirmation(false);
    };

    const handleDeleteCancel = () => {
        setShowConfirmation(false);
    }
    
    return (
        <>
        <div class="bg-gray-100 flex items-start justify-center h-screen">

        <div class="container mx-auto my-8" >

            <table class="mx-auto bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th class="py-2 px-4 border-b">{t('projects.id')}</th>
                        <th class="py-2 px-4 border-b">{t('projects.name')}</th>
                        <th class="py-2 px-4 border-b">{t('projects.team')}</th>
                        <th class="py-2 px-4 border-b">{t('projects.tasks')}</th>
                        <th class="py-2 px-4 border-b">{role === "admin" && t('projects.delete')}</th>
                    </tr>
                </thead>
                <tbody>
                    {projects && projects.map((project, index) => (
                        <tr key={index}>
                            <td class="py-2 px-4 border-b text-center">{project.id}</td>
                            <td class="py-2 px-4 border-b text-center" >{project.name}</td>
                            <td class="py-2 px-4 border-b text-center">{project.team?.name}</td>
                            <td class="py-2 px-4 border-b text-center"><button onClick={() => router.push('/tasks/project/' + project.id)}>{t('projects.tasks')}</button></td>
                            {project.id && role === "admin" && <td><button onClick={() => handleDeleteButton(project.id)}>{t('projects.delete')}</button></td>}
                        </tr>
                    ))}
                </tbody>
            </table>
            {showConfirmation && (
                            <>
                                <p>{t('projects.confirmation')}</p>
                                <button onClick={handleDeleteConfirm}>{t('confirm')}</button>
                                <button onClick={handleDeleteCancel}>{t('cancel')}</button>
                            </>
                        )}
            <p class=' text-red-600'>{statusMessage}</p>
        
            </div>
        </div>
        </>
    );
};

export default ProjectOverviewTable;