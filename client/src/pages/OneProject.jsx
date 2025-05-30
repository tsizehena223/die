import { useLocation, useNavigate } from "react-router-dom";
import NotFound from "./NotFound";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { baseUrlApi } from "../config/api";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import notask from "../assets/notask.svg";
import LeftSideBarTask from "../components/LeftSideBarTask";

const OneProject = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.pathname.split('/')[2];
  const isIdValid = !isNaN(id);
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const user = localStorage.getItem('userData');
  const [activePage, setActivePage] = useState(0);
  const [activeFilter, setActiveFilter] = useState(null);

  const handleStatusChange = async (index, newStatus, taskId) => {
    setLoading(true);

    try {
      const response  = await fetch(baseUrlApi + '/task/update/status', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'X-Authorization': `Bearer ${token}`},
        body: JSON.stringify({taskId, newStatus}),
      })

      const data = await response.json();
      if (!response.ok || data.errorMessage) {
        toast.error(data.errorMessage);
      } else if (data.successMessage) {
        setTasks(prevTasks =>
          prevTasks.map((task, i) =>
            i === index ? { ...task, status: newStatus } : task
          )
        );
        toast.success(data.successMessage);
      }
    } catch (e) {
      toast.error('An error has occured');
    } finally {
      setLoading(false);
    }
  };


  const arrayStatus = ['done', 'in progress', 'to do'];
  const tasksByFilter = (activeFilter || activeFilter === 0) ? tasks.filter(item => item.status === arrayStatus[activeFilter]) : tasks;

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
          navigate('/dashboard');
          toast.error('An error has occured');
        } else {
          setTasks(data);
        }
      } catch (error) {
        navigate('/dashboard');
        toast.error('An error has occured');
      } finally {
        setLoading(false);
      }
    };
    getTasks();
  }, [token, id, isIdValid, navigate])

  return (
    <>
      <Navbar user={user} activePage={activePage} setActivePage={setActivePage} showMenu={false} />
      <LeftSideBarTask activeFilter={activeFilter} setActiveFilter={setActiveFilter} projectId={id} />

      {loading ? (
        <Loading />
      ) : (!tasks || !isIdValid) ? (
        <NotFound />
      ) : (tasks.length < 1) ? (
        <div className="pl-0 md:pl-44 pt-20 text-white h-screen flex flex-col items-center justify-center">
          <p className="text-gray-400">No task yet</p>
          <img src={notask} alt="" className="h-40 my-4" />
        </div>
      ) : (
        <div className="pl-0 md:pl-44 flex flex-col items-center my-20 mx-2 sm:mx-10 md:mx-20 text-gray-300">
          <h2 className="text-2xl pt-10">My tasks [<code className="text-red-500">{tasks[0].project}</code>]</h2>
          <div className="my-4 text-gray-400 text-sm border px-8 py-2 rounded-lg border-gray-500">
            <p><i className="fa fa-circle text-green-500"></i>&nbsp;&nbsp; done</p>
            <p><i className="fa fa-circle text-red-500"></i>&nbsp;&nbsp; to do</p>
            <p><i className="fa fa-circle text-gray-200"></i>&nbsp;&nbsp; in progress</p>
          </div>
           
          <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs uppercase border border-gray-700 bg-gray-800 text-gray-400">
                <tr>
                  <th scope="col" className="pl-3 py-4">Title</th>
                  <th scope="col" className="pl-2 hidden sm:table-cell py-4">Project</th>
                  <th scope="col" className="pl-2 ">Status</th>
                  <th scope="col" className="pl-2 ">Deadline</th>
                  <th scope="col" className="pl-2 ">Done?</th>
                </tr>
              </thead>
              <tbody>
                {tasksByFilter.length === 0 ? (
                  <div className="fixed top-1/2 left-1/2 text-white">
                    Nothing in [{arrayStatus[activeFilter]}]
                  </div>
                ) : tasksByFilter.map((task, index) => {
                  return (
                    <tr key={index} className="border bg-gray-900 border-gray-700">
                      <th scope="row"className="pl-3 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {task.title}
                      </th>
                      <td className="pl-2 hidden sm:table-cell">{task.project}</td>
                      <td className="py-3 flex items-center justify-start"><i className={`fa fa-circle ${task.status === 'done' ? 'text-green-500' : (task.status === 'to do') ? 'text-red-500' : 'text-white'}`}></i>&nbsp;&nbsp;<span className="hidden sm:block">{task.status}</span></td>
                      <td className="pl-2">{task.deadline}</td>
                      <td className="pl-2 flex items-center justify-start py-8">
                        <i 
                          onClick={() => handleStatusChange(index, 'done', task.id)}
                          className={`pr-1 fa fa-circle text-green-500 hover:cursor-pointer ${task.status === 'done' ? 'fa-xl' : 'fa-sm'}`}
                        ></i>
                        <i 
                          onClick={() => handleStatusChange(index, 'to do', task.id)}
                          className={`pr-1 fa fa-circle text-red-500 hover:cursor-pointer ${task.status === 'to do' ? 'fa-xl' : 'fa-sm'}`}
                        ></i>
                        <i 
                          onClick={() => handleStatusChange(index, 'in progress', task.id)}
                          className={`pr-1 fa fa-circle text-gray-200 hover:cursor-pointer ${task.status === 'in progress' ? 'fa-xl' : 'fa-sm'}`}
                        ></i>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}

export default OneProject;
