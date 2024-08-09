import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

const Home = () => {
    const navigate = useNavigate();
    const hasToken = localStorage.getItem('dieToken') ? true : false;

    const handleNavigate = () => {
        navigate(hasToken ? '/dashboard' : '/login');
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 h-screen w-screen">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 h-screen">
                <img src={logo} alt="" className="rounded-full size-24 animate-bounce" />
                <div className="flex flex-col justify-center items-center mt-4">
                    <p className="text-center text-sky-400 text-3xl mb-3">Project Management System</p>
                    <p className="text-center text-gray-400">do it efficiently &nbsp;...&nbsp; make it easier</p>
                    <button onClick={handleNavigate} className="text-white mt-8 border px-12 py-2 rounded-full bg-gray-700 hover:bg-gray-900">
                        Let's go
                        <i className="fa fa-circle-arrow-right fa-lg ml-4 text-gray-300"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Home;