import { useLocation, useNavigate } from "react-router-dom";
import NotFound from "./NotFound";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { baseUrlApi } from "../config/api";

const OneProject = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.pathname.split('/')[2];
  const isIdValid = !isNaN(id);
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      if (!token || !isIdValid) return;
      setLoading(true);
      try {
        const response = await fetch(baseUrlApi + `/${id}/tasks`, {
          method: 'GET',
          headers: {'Content-Type': 'application/json', 'X-Authorization': `Bearer ${token}`},
        })

        const data = await response.json();
        if (!response.ok) {
          navigate('/project');
          toast.error('An error has occured');
        } else {
          setTasks(data);
        }
      } catch (error) {
        navigate('/project');
        toast.error('An error has occured');
      } finally {
        setLoading(false);
      }
    };
    getTasks();
  }, [token, id, isIdValid, navigate])

  return (
    <>
      {loading ? (
        <div className="h-screen flex flex-col justify-center projects-center text-white absolute left-1/2 transform -translate-x-1/2">
          <i className="fa fa-spinner animate-spin fa-2xl mb-4"></i>
          <p className="text-sm mt-2">Wait just a sec...</p>
        </div>
      ) : (!tasks || !isIdValid) ? (
        <NotFound />
      ) : (
        <>
          <div className="h-auto flex flex-col rounded-xl bg-gray-800 p-6 mx-10 sm:mx-0 text-center shadow-xl">
            {tasks.map((task, index) => {
              return (
                <div key={index}>{task.id}</div>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}

export default OneProject;