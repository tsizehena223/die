import React, { useState } from 'react';

const AddProjectForm = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleButtonClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseClick = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <button 
        className="flex items-center px-4 py-2 border-white mt-6 bg-gray-700 border rounded-xl"
        onClick={handleButtonClick}
      >
        <i className="hidden sm:flex fa fa-plus bg-gray-900 rounded-2xl size-8 items-center justify-center"></i>
        <p className="ml-2 text-center">Add new project</p>
      </button>
      {isModalVisible && (
        <div className="absolute w-96 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add new project
              </h3>
              <button 
                type="button" 
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" 
                onClick={handleCloseClick}
              >
                <i className="fa-regular fa-circle-xmark fa-xl"></i>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                  <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder='Title' required />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="deadline" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Deadline</label>
                  <input type="date" name="deadline" id="deadline" className="bg-gray-50 border text-white border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                  <select id="status" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                    <option value="todo">To do</option>
                    <option value="doing">In progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Description</label>
                  <textarea id="description" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Description of the project"></textarea>                    
                </div>
              </div>
              <button className="border border-gray-500 rounded-md py-2 px-4 bg-gray-800">
                Add project
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProjectForm;

