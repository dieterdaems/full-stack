import ProjectService from "@/services/ProjectService";
import { Project } from "@/types";
import { useRouter } from "next/router";

type Props = {
    projects: Project[] | undefined;
};


const ProjectOverviewTable: React.FC<Props> = ({ projects }: Props) => {
    const router = useRouter();

    const deleteProject = (id: number) => async () => {
        const response = await ProjectService.deleteProject(String(id));
    };

    return (
        <>
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Naam</th>
                    <th>View Tasks</th>
                    <th>Delete Project</th>
                </tr>
            </thead>
            <tbody>
                {projects && projects.map((project, index) => (
                    <tr key={index}>
                        <td>{project.id}</td>
                        <td>{project.name}</td>
                        <td><button onClick={() => router.push('/tasks/project/' + project.id)}>View Tasks</button></td>
                        {project.id && <td><button onClick={deleteProject(project.id)}>Delete</button></td>}
                    </tr>
                ))}
            </tbody>
        </table>
        
        </>
    );
};

export default ProjectOverviewTable;