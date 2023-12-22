
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

export type { Project, Task, StatusMessage };