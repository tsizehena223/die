const Loading = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-white absolute left-1/2 transform -translate-x-1/2">
      <i className="fa fa-spinner animate-spin fa-2xl mb-4"></i>
      <p className="text-sm mt-2">Wait just a sec...</p>
    </div>
  )
}

export default Loading;