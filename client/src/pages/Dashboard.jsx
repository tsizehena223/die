import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Projects from "../components/Projects";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Dashboard = () => {
  const user = localStorage.getItem('userData');
  const userToken = localStorage.getItem('dieToken');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !userToken) {
      navigate('/login');
      toast.error('You are not connected');
    }
  }, [user, userToken, navigate]);

  return (
      <>
        <Navbar user={user} />
        <Projects />
      </>
  )
}

export default Dashboard;