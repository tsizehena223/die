import { useState } from "react";

const LeftSideBar = ({activeFilter, setActiveFilter}) => {
  const [showLfb, setShowLfb] = useState(true);

  const handleLfb = () => {
    setShowLfb((prev) => !prev);
  }

  const status = ['Done', 'In progress', 'To do'];

  return (
    <>
      <span onClick={handleLfb}><i className="z-10 text-white fa fa-filter fixed top-20 left-2 hover:cursor-pointer"></i></span>
      <div className={`${showLfb ? '' : 'hidden' } z-10 fixed flex flex-col items-start pl-2 gap-4 top-16 w-44 bg-gray-800 border border-gray-900 h-screen text-white pt-14`}>
        <div className="flex w-36 items-center">
          <h3 className="font-bold">Filter</h3>
          <span onClick={() => setActiveFilter(null)}><i className="z-10 relative left-20 text-white fa fa-filter-circle-xmark hover:cursor-pointer"></i></span>
        </div>
        <ul className="space-y-4">
          {status.map((item, index) => {
            return (
              <li
                key={index}
                className={`border px-4 py-2 rounded-lg w-36 border-gray-500 hover:bg-gray-700 hover:cursor-pointer ${activeFilter === index ? 'bg-gray-900' : ''}`}
                onClick={() => setActiveFilter(index)}
              >
                <i className={`fa ${index === 0 ? 'fa-check-circle text-green-500' : index === 1 ? 'fa-circle' : 'fa-xmark-circle text-red-500'} mr-3 `}></i>
                {item} 
              </li>
            )
          })}
        </ul>
        <span onClick={handleLfb}><i className="md:hidden fa fa-xmark fixed top-20 left-36 hover:cursor-pointer"></i></span>
      </div>
    </>
  )
}

export default LeftSideBar;