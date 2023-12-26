type User = {
    id?: number;
    name: string;
    specialisation: string;
    email: string;
    password?: string;
}

type Team = {
    id?: number;
    name: string;
    users: User[];
}

type Task = {
    id?: number;
    name: string;
    description: string;
    deadline: Date;
    project: Project;
    completed: boolean;
}

type Project = {
    id?: number;
    name?: string;
}

type StatusMessage = {
    type: 'error' | 'success';
    message: string
}

export type { User, Project, Task, StatusMessage, Team };