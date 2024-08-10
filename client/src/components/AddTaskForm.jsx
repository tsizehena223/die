import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { baseUrlApi } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

const AddTaskForm = ({projectId}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [deadline, setDeadline] = useState('');
  const project = projectId;
  const [assignTo, setAssignTo] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('userData'));

  const handleButtonClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseClick = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      if (!token) return;
      try {
        const response = await fetch(baseUrlApi + "/users/all", {
          method: 'GET',
          headers: {"Content-Type": 'application/json', 'X-Authorization': `Bearer ${token}`},
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.errorMessage ?? 'An error has occured');
          toast.error(error);
        } else {
          setUsers(data);
        }
      } catch (error) {
        toast.error('An error has occured');
      } finally {
        setLoading(false);
      }
    }
    getUsers();
  }, [error, token])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!token) return;
    try {
      const response = await fetch(baseUrlApi + "/task/add", {
        method: 'POST',
        headers: {"Content-Type": 'application/json', 'X-Authorization': `Bearer ${token}`},
        body: JSON.stringify({title, assignTo, deadline, project, status})
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.errorMessage ?? 'An error has occured');
        toast.error(error);
      } else {
        toast.success('Task add successfully');
        navigate(0);
      }
    } catch (error) {
      toast.error('An error has occured');
    } finally {
      setLoading(false);
      handleCloseClick();
    }
  }

  return (
    <>
      <button 
        className="flex items-center px-4 py-2 border-gray-500 mt-6 bg-gray-800 border rounded-xl"
        onClick={handleButtonClick}
      >
        <i className="hidden sm:flex fa fa-plus bg-gray-900 rounded-2xl size-8 items-center justify-center"></i>
        <p className="ml-2 text-center">Add new task</p>
      </button>
      {loading ? (
        <Loading />
      ) : (
        isModalVisible && (
          <div className="absolute mt-0 w-96 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add new task
                </h3>
                <button 
                  type="button" 
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" 
                  onClick={handleCloseClick}
                >
                  <i className="fa-regular fa-circle-xmark fa-xl"></i>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder='Title' required />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="deadline" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Deadline</label>
                    <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} name="deadline" id="deadline" className="bg-gray-50 border text-white border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required >
                      <option value="" disabled>Select ...</option>
                      <option value="to do">To do</option>
                      <option value="in progress">In progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="assignTo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Assign to</label>
                    <select id="assignTo" value={assignTo} onChange={(e) => setAssignTo(e.target.value)} style={{ height: '4rem' }} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required>
                      <option value="" disabled>Select ...</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {(currentUser?.id &&user.id === currentUser.id) ? 'Me' : user.email}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type='submit' className="border border-gray-500 rounded-md py-2 px-4 bg-gray-800">
                  Add task
                </button>
              </form>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default AddTaskForm;