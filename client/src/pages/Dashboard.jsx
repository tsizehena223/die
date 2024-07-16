import Navbar from "../components/Navbar";

const Dashboard = () => {
  const user = localStorage.getItem('userData');

  return (
      <div className="bg-gray-900 h-screen w-screen">
        <Navbar user={user} />
      </div>
  )
}

export default Dashboard;