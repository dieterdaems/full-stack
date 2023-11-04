import { Project } from "@/types";

type Props = {
    projects: Project[] | undefined;
};

const ProjectOverviewTable: React.FC<Props> = ({ projects }: Props) => {
    return (
        <>
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Naam</th>
                </tr>
            </thead>
            <tbody>
                {projects && projects.map((project, index) => (
                    <tr key={index}>
                        <td>{project.id}</td>
                        <td>{project.name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        
        </>
    );
};

export default ProjectOverviewTable;