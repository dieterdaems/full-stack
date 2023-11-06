import { Project } from "@/types";
import { useRouter } from "next/router";

type Props = {
    projects: Project[] | undefined;
};


const ProjectOverviewTable: React.FC<Props> = ({ projects }: Props) => {
    const router = useRouter();
    return (
        <>
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Naam</th>
                    <th>View Tasks</th>
                </tr>
            </thead>
            <tbody>
                {projects && projects.map((project, index) => (
                    <tr key={index}>
                        <td>{project.id}</td>
                        <td>{project.name}</td>
                        <td><button onClick={() => router.push('/tasks/project/' + project.id)}>View Tasks</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
        
        </>
    );
};

export default ProjectOverviewTable;