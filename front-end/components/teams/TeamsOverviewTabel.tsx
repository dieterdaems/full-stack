import { Team } from "@/types";

type Props = {
    teams: Team[];
};

const TeamsOverviewTabel: React.FC<Props> = ({ teams }: Props) => {
    return (
        <>
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Total members</th>
                </tr>
            </thead>
            <tbody>
                {teams && teams.map((team, index) => (
                    <tr key={index}>
                        <td>{team.id}</td>
                        <td>{team.name}</td>
                        <td>{team.users.length}</td>
                    </tr>
                ))}
            </tbody>
        </table>        
        </>
    );
};

export default TeamsOverviewTabel;
