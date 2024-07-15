import { useNavigate } from "react-router-dom";
import notFound from "../assets/notfound.png";

const NotFound = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/');
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 h-screen w-screen">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 h-screen">
                <img src={notFound} alt="" className="rounded-full size-20 animate-bounce" />
                <div className="flex flex-col justify-center items-center mt-4">
                    <p className="text-gray-400">There's no page for this url ...</p>
                    <button onClick={handleNavigate} className="text-white mt-8 border border-gray-700 px-5 py-2 rounded-full bg-gray-800 hover:bg-gray-900">
                       Go back home 
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotFound;