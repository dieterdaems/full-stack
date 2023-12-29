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
        <table>
            <thead>
                <tr>
                    <th>{t('projects.id')}</th>
                    <th>{t('projects.name')}</th>
                    <th>Team assigned</th>
                    <th>{t('projects.tasks')}</th>
                    <th>{t('projects.delete')}</th>
                </tr>
            </thead>
            <tbody>
                {projects && projects.map((project, index) => (
                    <tr key={index}>
                        <td>{project.id}</td>
                        <td>{project.name}</td>
                        <td>{project.team?.name ? 'no team' : project.team?.name}</td>
                        <td><button onClick={() => router.push('/tasks/project/' + project.id)}>{t('projects.tasks')}</button></td>
                        {project.id && <td><button onClick={() => handleDeleteButton(project.id)}>{t('projects.delete')}</button></td>}
                    </tr>
                ))}
            </tbody>
        </table>
        {showConfirmation && (
                            <>
                                <p>Are you sure you want to delete this user?</p>
                                <button onClick={handleDeleteConfirm}>Confirm</button>
                                <button onClick={handleDeleteCancel}>Cancel</button>
                            </>
                        )}
            <p>{statusMessage}</p>
        
        </>
    );
};

export default ProjectOverviewTable;