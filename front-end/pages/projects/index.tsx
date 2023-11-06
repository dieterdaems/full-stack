import ProjectOverviewTable from "@/components/projects/ProjectsOverviewTable";
import ProjectService from "@/services/ProjectService";
import { Project } from "@/types";
import { Head } from "next/document";
import { mainModule } from "process";
import { useEffect, useState, useDeferredValue } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const Projects: React.FC = () => {

    const fetchProjects = async () => {
        
        const response = await ProjectService.getAll();
        const projects = await response.json();
        
        return projects;
    }

// useEffect(() => {
//     fetchProjects();
// }, []);

const {data, isLoading, error} = useSWR('projectsFromDb', fetchProjects);

useInterval(() => {
    mutate('projectsFromDb', fetchProjects());
}, 5000);


return (
    <>
    <main>
        <h1>Projects</h1>
        {error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>}
        <section>
            {data && (<ProjectOverviewTable projects={data} />) }
        </section>
    </main>
    
    
    </>

)

    };

export default Projects;
