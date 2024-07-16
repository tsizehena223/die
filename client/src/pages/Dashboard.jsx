import Navbar from "../components/Navbar";
import Projects from "../components/Projects";

const Dashboard = () => {
  const user = localStorage.getItem('userData');

  return (
      <>
        <Navbar user={user} />
        <Projects />
      </>
  )
}

export default Dashboard;