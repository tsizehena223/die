import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem('dieToken');
    navigate('/');
    toast.success('Logged out successfully');
  }

  return (
    <>
      <h1>Dashboard</h1>
      <button onClick={handleLogOut}>Log out</button>
    </>
  )
}

export default Dashboard;