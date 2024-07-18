import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Projects from "../components/Projects";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const [activePage, setActivePage] = useState(0);
  const user = localStorage.getItem('userData');
  const userToken = localStorage.getItem('dieToken');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (!user || !userToken) {
      navigate('/login');
      toast.error('You are not connected');
    }
  }, [user, userToken, navigate]);

  return (
      <>
        <Navbar user={user} activePage={activePage} setActivePage={setActivePage} />
        <Projects activePage={activePage} />
      </>
  )
}

export default Dashboard;