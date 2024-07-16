const Projects = () => {
  const projects = ['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5', 'Project 6'];
  const colors = ["bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-500", "bg-purple-500"];

  const getRandomColor = () => {
      const randomIndex = Math.floor(Math.random() * colors.length);
      return colors[randomIndex];
  };

  return (
    <div className="w-full h-auto pb-4 pt-28 sm:pt-20">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 sm:m-10 m-0">
        {projects.map((item, index) => {
          return (
            <div key={index} className="rounded-xl bg-gray-800 p-6 mx-10 sm:mx-0 text-center shadow-xl">
              <div className={`mx-auto flex h-16 w-16 -translate-y-12 transform items-center justify-center rounded-full ${getRandomColor()} shadow-lg shadow-teal-500/40`}>
                <i className={`fas fa-laptop-file fa-xl text-gray-100`}></i>
              </div>
              <h1 className="text-white mb-3 text-xl font-medium lg:px-4">{item}</h1>
              <p className="text-gray-400">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo iure inventore amet
                accusantium vero perspiciatis, incidunt dicta sed aspernatur!
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Projects;