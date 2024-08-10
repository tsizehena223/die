import { useState } from "react";
import logo from "../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Navbar = ({user, activePage, setActivePage, showMenu}) => {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const navigate = useNavigate();
  const currentUser = JSON.parse(user);
  const username = user ? currentUser.username : 'User';
  const { logout } = useAuth();

  const handleLogOut = () => {
    localStorage.removeItem('dieToken');
    localStorage.removeItem('userData');
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  }

  const toggleShowMenu = () => {
    const menu = document.getElementById("mobile-menu");

    menu.toggleAttribute('hidden');
    setIsMenuActive(prev => !prev);
  }

  const menuItems = ['Projects', 'Team', 'New +'];

  const displayName = (p) => {
    if (p.length >= 10) {
      return p.substring(0, 10); 
    }
    return p;
  };

  return (
    <nav className="fixed bg-gray-800 top-0 w-screen z-50">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <button onClick={toggleShowMenu} className="absolute ml-2 flex items-center sm:hidden">
            <i id="menu-bar" className={`fa fa-bars${!isMenuActive ? '-staggered' : ''} fa-xl text-cyan-400`}></i>
            <Link to="/dashboard" className="ml-4 text-gray-200 text-2xl">die</Link>
          </button>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Link to="/dashboard" className="items-center hidden sm:flex">
              <img className="size-12 rounded-full" src={logo} alt=""/>
            </Link>
            <div className={`hidden sm:ml-8 sm:flex items-center sm:${!showMenu && 'hidden'}`}>
              <ul className="flex space-x-4 text-sm font-medium text-gray-200">
                {menuItems.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className={`rounded-full py-2 px-3 hover:bg-gray-700 hover:cursor-pointer ${activePage === index ? 'bg-gray-900' : ''}`}
                      onClick={() => setActivePage(index)}
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
              <button onClick={handleLogOut} className="fa fa-sign-out fa-lg text-red-500 mr-3"></button>
              <div className="flex bg-gray-900 pr-1 pl-4 py-1.5 rounded-full hover:cursor-pointer">
                <p className="text-gray-200 mr-2 font-medium">{ displayName(username) }</p>
                <button className="fa fa-circle-user fa-xl text-gray-200"></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${isMenuActive ? 'block' : 'hidden'} ${!showMenu && 'hidden'}`} id="mobile-menu">
        <ul className="space-y-2 px-4 pb-3 pt-2 text-sm font-medium text-gray-200">
          {menuItems.map((item, index) => {
            return (
              <li
                key={index}
                className={`rounded-md py-2 px-3 hover:bg-gray-700 hover:cursor-pointer ${activePage === index ? 'bg-gray-900' : ''}`}
                onClick={() => {
                  setActivePage(index);
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