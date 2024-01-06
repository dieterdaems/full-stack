
const ExistingUsersTable: React.FC = () => {
    return (
        <>
            <div className="bg-gray-100 flex items-start justify-center">
                <div className="container mx-auto my-8" >
                    <table className="mx-auto bg-white border border-gray-300">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-r">Email</th>
                                <th className="py-2 px-4 border-b border-r">Password</th>
                                <th className="py-2 px-4 border-b border-r">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                                <tr>
                                    <td className="py-2 px-4 border-b text-center border-r">greetjej@ucll.be</td>
                                    <td className="py-2 px-4 border-b text-center border-r">greetjej123</td>
                                    <td className="py-2 px-4 border-b text-center border-r">user</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-4 border-b text-center border-r">elkes@ucll.be</td>
                                    <td className="py-2 px-4 border-b text-center border-r">elkes123</td>
                                    <td className="py-2 px-4 border-b text-center border-r">user</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-4 border-b text-center border-r">johanp@ucll.be</td>
                                    <td className="py-2 px-4 border-b text-center border-r">johanp123</td>
                                    <td className="py-2 px-4 border-b text-center border-r">admin</td>
                                </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default ExistingUsersTable;
