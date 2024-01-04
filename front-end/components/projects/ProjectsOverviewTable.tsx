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
        <div className="bg-gray-100 flex items-start justify-center">

        <div className="container mx-auto my-8" >

            <table className="mx-auto bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-r">{t('projects.id')}</th>
                        <th className="py-2 px-4 border-b border-r">{t('projects.name')}</th>
                        <th className="py-2 px-4 border-b border-r">{t('projects.team')}</th>
                        <th className="py-2 px-4 border-b">{t('tasks.title')}</th>
                        {role === "admin" && <th className="py-2 px-4 border-b border-l">{t('projects.delete')}</th>}
                    </tr>
                </thead>
                <tbody>
                    {projects && projects.map((project, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 border-b text-center border-r">{project.id}</td>
                            <td className="py-2 px-4 border-b text-center border-r" >{project.name}</td>
                            <td className="py-2 px-4 border-b text-center border-r">{project.team?.name}</td>
                            <td className="py-2 px-4 border-b text-center"><button className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 bg-gray-900 rounded-lg hover:bg-gray-800 focus:shadow-outline focus:outline-none"
                                    onClick={() => router.push('/tasks/project/' + project.id)}>{t('projects.tasks')}</button></td>
                            {project.id && role === "admin" && <td className="py-2 px-4 border-b text-center border-l"><button className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 bg-gray-900 rounded-lg hover:bg-gray-800 focus:shadow-outline focus:outline-none"
                                    onClick={() => handleDeleteButton(project.id)}>{t('projects.delete')}</button></td>}
                        </tr>
                    ))}
                </tbody>
            </table>
            {showConfirmation && (
                            <>
                                <p>{t('projects.confirmation')}</p>
                                <button className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 bg-gray-900 rounded-lg hover:bg-gray-800 focus:shadow-outline focus:outline-none"
                                onClick={handleDeleteConfirm}>{t('confirm')}</button>
                                <button className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 bg-gray-900 rounded-lg hover:bg-gray-800 focus:shadow-outline focus:outline-none"
                                onClick={handleDeleteCancel}>{t('cancel')}</button>
                            </>
                        )}
            <p className=' text-red-600'>{statusMessage}</p>
        
            </div>
        </div>
        </>
    );
};

export default ProjectOverviewTable;