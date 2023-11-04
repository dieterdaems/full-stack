const getAll = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/tasks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const TaskService = {
    getAll
}

export default TaskService;