import { useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = (props) => {
  const [activeItem, setActiveItem] = useState(0);
  const [isMenuActive, SetIsMenuActive] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(props.user);
  const username = user ? user.username : 'User';

  const handleLogOut = () => {
    localStorage.removeItem('dieToken');
    localStorage.removeItem('userData');
    navigate('/');
    toast.success('Logged out successfully');
  }

  const toggleShowMenu = () => {
    const menu = document.getElementById("mobile-menu");

    menu.toggleAttribute('hidden');
    SetIsMenuActive(prev => !prev);
  }

  const menuItems = ['Projects', 'Tasks', 'Team'];

  return (
    <nav className="fixed bg-gray-800 top-0 w-screen z-50">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <button onClick={toggleShowMenu} className="absolute ml-2 flex items-center sm:hidden">
            <i id="menu-bar" className={`fa fa-bars${!isMenuActive ? '-staggered' : ''} fa-xl text-cyan-400`}></i>
            <p className="ml-4 text-gray-200 text-2xl">die</p>
          </button>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="items-center hidden sm:flex">
              <img className="size-12 rounded-full" src={logo} alt=""/>
            </div>
            <div className="hidden sm:ml-8 sm:flex items-center">
              <ul className="flex space-x-4 text-sm font-medium text-gray-200">
                {menuItems.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className={`rounded-md py-2 px-3 hover:bg-gray-700 hover:cursor-pointer ${activeItem === index ? 'bg-gray-900' : ''}`}
                      onClick={() => setActiveItem(index)}
                    >
                      {item}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="flex relative ml-3">
              <div className="flex border border-gray-200 pr-1 pl-4 py-2 rounded-full hover:cursor-pointer">
                <p className="text-gray-200 mr-2 font-medium">{ username }</p>
                <button className="fa fa-circle-user fa-2xl text-gray-200"></button>
              </div>
              <button onClick={handleLogOut} className="fa fa-sign-out fa-xl text-red-500 ml-3"></button>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:hidden" id="mobile-menu">
        <ul className="space-y-2 px-4 pb-3 pt-2 text-sm font-medium text-gray-200">
          {menuItems.map((item, index) => {
            return (
              <li
                key={index}
                className={`rounded-md py-2 px-3 hover:bg-gray-700 hover:cursor-pointer ${activeItem === index ? 'bg-gray-900' : ''}`}
                onClick={() => {
                  setActiveItem(index);
                  toggleShowMenu();
                }}
              >
                {item}
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  ) 
}

export default Navbar;