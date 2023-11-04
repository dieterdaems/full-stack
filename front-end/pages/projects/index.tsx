import ProjectOverviewTable from "@/components/projects/ProjectsOverviewTable";
import ProjectService from "@/services/ProjectService";
import { Project } from "@/types";
import { Head } from "next/document";
import { mainModule } from "process";
import { useEffect, useState, useDeferredValue } from "react";

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>();

    const fetchProjects = async () => {
        const response = await ProjectService.getAll();
        const projects = await response.json();
        setProjects(projects);
    }

useEffect(() => {
    fetchProjects();
}, []);


return (
    <>
    <main>
        <h1>Projects</h1>
        <section>
            {projects && (<ProjectOverviewTable projects={projects} />) || (<p>Loading...</p>)}
        </section>
    </main>
    
    
    </>

)

    };

export default Projects;
