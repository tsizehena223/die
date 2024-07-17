import { toast } from "react-toastify";
import { baseUrlApi, dieToken } from "../config/api";
import { useEffect, useState } from "react";

const Projects = () => {
  const colors = ["bg-red-500", "bg-green-500", "bg-cyan-500"];
  const [projects, setProjects] = useState([]);
  const token = dieToken;

  console.log(projects);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const response = await fetch(baseUrlApi + '/project/all', {
          method: 'GET',
          headers: {'X-Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'},
        })

        const data = await response.json();
        if (!response.ok) {
          if (data.message) {
            toast.error(data.message);
          }
        } else {
          console.log(data);
          setProjects(data);
        }
      } catch (error) {
        toast.error('An error has occured while fetching projects');
      }
    };
    getProjects();
  }, [token]);

  return (
    <div className="w-full h-auto pb-4 pt-28 sm:pt-20">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 sm:m-10 m-0">
        {projects.map((item, index) => {
          return (
            <div key={index} className="h-80 rounded-xl bg-gray-800 p-6 mx-10 sm:mx-0 text-center shadow-xl">
              <div className={`mx-auto flex h-16 w-16 -translate-y-12 transform items-center justify-center rounded-full ${item.status === 'done' ? colors[2] : (item.status === 'doing' ? colors[1] : colors[0])} shadow-lg shadow-teal-500/40`}>
                <i className={`fas fa-laptop-file fa-xl text-gray-100`}></i>
              </div>
              <h1 className="text-white mb-3 text-xl font-medium lg:px-4">{item.title}</h1>
              <p className="text-gray-400">{item.description}</p>
              <button type="button" className="text-cyan-400 hover:text-black border border-cyan-400 hover:bg-cyan-400 focus:ring-4 focus:outline-none focus:ring-cyan-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                View details
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Projects;