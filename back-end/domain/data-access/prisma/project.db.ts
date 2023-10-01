import { Project } from "../../model/project";


const projects: Project[] = [
    new Project({name: 'Project 1', id: 1, team: null}),
    new Project({name: 'Project 2', id: 2, team: null}),
];

const getAllProjects = (): Project[] => projects;
const getProjectById = (id: number) : Project => projects.find((p) => p.id === id);

export default { getAllProjects, getProjectById};