import Navbar from "../components/Navbar";
import Projects from "../components/Projects";

const Dashboard = () => {
  const user = localStorage.getItem('userData');

  return (
      <div className="bg-gray-900">
        <Navbar user={user} />
        <Projects />
      </div>
  )
}

export default Dashboard;