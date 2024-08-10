import { useLocation, useNavigate } from "react-router-dom";
import NotFound from "./NotFound";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { baseUrlApi } from "../config/api";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import notask from "../assets/notask.svg";

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

  console.log(tasks)

  return (
    <>
      <Navbar user={user} activePage={activePage} setActivePage={setActivePage} showMenu={false} />
      {loading ? (
        <Loading />
      ) : (!tasks || !isIdValid) ? (
        <NotFound />
      ) : (tasks.length < 1) ? (
        <div className="mx-20 pt-20 text-white h-screen flex flex-col items-center justify-center">
          <p className="text-gray-400">No task yet</p>
          <img src={notask} alt="" className="h-40 my-4" />
          <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 mt-4">New task</button>
        </div>
      ) : (
        <div className="my-20 mx-2 sm:mx-10 md:mx-20 text-gray-300">
          <h2 className="text-2xl pt-10 pb-4">My tasks [<code className="text-red-500">{tasks[0].project}</code>]</h2>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="text-center py-4">Title</th>
                  <th scope="col" className="text-center hidden sm:table-cell py-4">Project</th>
                  <th scope="col" className="text-center">Status</th>
                  <th scope="col" className="text-center">Deadline</th>
                  <th scope="col" className="text-center">Done ?</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => {
                  return (
                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row"className="text-center py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {task.title}
                      </th>
                      <td className="text-center hidden sm:table-cell">{task.project}</td>
                      <td className="py-3 flex items-center justify-center"><i className={`fa fa-${task.status === 'done' ? 'check text-green-500' : (task.status === 'to do') ? 'xmark text-red-500' : 'circle text-white'}`}></i>&nbsp; <span className="hidden sm:block">{task.status}</span></td>
                      <td className="text-center">{task.deadline}</td>
                      <td className="text-center">
                        <i className={`fa fa-check-circle text-blue-500 fa-xl hover:cursor-pointer hover:text-green-500 ${task.status === 'done' && 'hidden'}`}></i>
                        <i className={`fa fa-xmark-circle text-red-500 fa-xl hover:cursor-pointer hover:text-green-500 ${(task.status === 'to do' || task.status === 'in progress') && 'hidden'}`}></i>
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