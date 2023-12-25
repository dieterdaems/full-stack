import { User } from "@/types";

const getAll = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const create = ({name, specialisation, email, password} : User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            specialisation,
            email,
            password
        })
    });
}

const UserService = {
    getAll,
    create,
}

export default UserService;
