import ProjectService from "@/services/ProjectService";
import { Project } from "@/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

type Props = {
    projects: Project[] | undefined;
};


const ProjectOverviewTable: React.FC<Props> = ({ projects }: Props) => {
    const router = useRouter();
    const { t } = useTranslation();

    const deleteProject = (id: number) => async () => {
        const response = await ProjectService.deleteProject(String(id));
    };

    return (
        <>
        <table>
            <thead>
                <tr>
                    <th>{t('projects.id')}</th>
                    <th>{t('projects.name')}</th>
                    <th>{t('projects.tasks')}</th>
                    <th>{t('projects.delete')}</th>
                </tr>
            </thead>
            <tbody>
                {projects && projects.map((project, index) => (
                    <tr key={index}>
                        <td>{project.id}</td>
                        <td>{project.name}</td>
                        <td><button onClick={() => router.push('/tasks/project/' + project.id)}>{t('projects.tasks')}</button></td>
                        {project.id && <td><button onClick={deleteProject(project.id)}>{t('projects.delete')}</button></td>}
                    </tr>
                ))}
            </tbody>
        </table>
        
        </>
    );
};

export default ProjectOverviewTable;