
type Task = {
    id?: number;
    name: string;
    description: string;
    deadline: Date;
    project: Project;
}

type Project = {
    id: number;
    name?: string;
    tasks?: Task[];
}

export type { Project, Task };