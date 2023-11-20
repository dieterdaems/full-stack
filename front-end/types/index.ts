
type Task = {
    id?: number;
    name: string;
    description: string;
    deadline: Date;
    project: Project;
    completed: boolean;
}

type Project = {
    id: number;
    name?: string;
    tasks?: Task[];
}

type StatusMessage = {
    type: 'error' | 'success';
    message: string
}

export type { Project, Task, StatusMessage };