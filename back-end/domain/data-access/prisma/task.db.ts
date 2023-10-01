import { Task } from "../../model/task";

const tasks: Task[] = [
    new Task({name: 'Task 1', id: 1, description: 'Task 1', deadline: new Date(), project: null}),
    new Task({name: 'Task 2', id: 2, description: 'Task 2', deadline: new Date(), project: null}),
];

const getAllTasks = (): Task[] => tasks;
const getTaskById = (id: number) : Task => tasks.find((p) => p.id === id);

export default { getAllTasks, getTaskById};