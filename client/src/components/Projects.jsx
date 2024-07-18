import { toast } from "react-toastify";
import { baseUrlApi } from "../config/api";
import { useEffect, useState } from "react";
import notask from "../assets/notask.svg";
import { useAuth } from '../context/AuthContext';

const Projects = () => {
  const colors = ["bg-green-500", "bg-blue-500", "bg-red-500"];
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const description = (p) => {
    if (p.length >= 150) {
      return p.substring(0, 150) + "..."; 
    }
    return p;
  };

  useEffect(() => {
    const getProjects = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const response = await fetch(baseUrlApi + '/project/all', {
          method: 'GET',
          headers: {'X-Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'},
        });

        const data = await response.json();
        if (!response.ok) {
          if (data.message) {
            toast.error(data.message);
          }
        } else {
          setProjects(data);
        }
      } catch (error) {
        toast.error('An error has occurred while fetching projects');
      } finally {
        setLoading(false);
      }
    };
    getProjects();
  }, [token]);

  return (
    <>
      {loading ? (
        <div className="h-screen flex flex-col justify-center items-center text-white absolute left-1/2 transform -translate-x-1/2">
          <i className="fa fa-spinner animate-spin fa-2xl mb-4"></i>
          <p className="text-sm mt-2">Wait just a sec...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="h-screen flex flex-col justify-center items-center text-white absolute left-1/2 transform -translate-x-1/2">
          <p className="text-xl mb-8 text-center">No project added yet!</p>
          <img src={notask} alt="" className="h-40" />
          <button className="flex items-center px-4 py-2 border-white mt-6 bg-gray-700 border rounded-xl">
            <i className="fa fa-plus bg-gray-900 rounded-2xl size-8 flex items-center justify-center"></i>
            <p className="ml-2">Add new project</p>
          </button>
        </div>
      ) : (
        <div className="w-full h-auto pb-4 pt-28 sm:pt-20">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 sm:m-10 m-0">
            {projects.map((item, index) => {
              return (
                <div key={index} className="h-auto flex flex-col rounded-xl bg-gray-800 p-6 mx-10 sm:mx-0 text-center shadow-xl">
                  <div className={`mx-auto flex h-16 w-16 -translate-y-12 transform items-center justify-center rounded-full ${item.status === 'done' ? colors[0] : (item.status === 'doing' ? colors[1] : colors[2])} shadow-lg shadow-teal-500/40`}>
                    <i className={`fas fa-laptop-file fa-xl text-gray-100`}></i>
                  </div>
                  <p className={`-top-10 relative text-sm ${(item.status === 'done') ? 'text-green-500' : (item.status === 'doing') ? 'text-blue-500' : 'text-red-500'}`}>
                    ({item.status})
                  </p>
                  <h1 className="-mt-4 text-white text-xl font-medium lg:px-4">{item.title}</h1>
                  <p className="text-sm text-gray-300 font-medium">Deadline : {item.deadline}</p>
                  <p className="text-gray-400 my-6">{description(item.description)}</p>
                  <button type="button" className="mx-auto w-48 mt-auto mb-4 text-cyan-400 hover:text-black border border-cyan-400 hover:bg-cyan-400 focus:ring-4 focus:outline-none focus:ring-cyan-400 font-medium rounded-lg text-sm py-2.5">
                    View details
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default Projects;
