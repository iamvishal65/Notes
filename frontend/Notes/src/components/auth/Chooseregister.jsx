import React, { use } from 'react'
import { useNavigate } from 'react-router-dom';
const Chooseregister = () => {
  function goToReister(){
    navigate('/register')
  }
  function goToLogin(){
    navigate('/login')
  }
  const navigate=useNavigate();
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='flex flex-col gap-3 p-4  bg-gray-50 rounded'>
        <span className='text-cyan-500  p-1 rounded'>Don't have account</span>
        <button className='bg-amber-300 p-1 rounded  hover:bg-red-600' onClick={goToReister}>Register</button>
        <span className='text-cyan-500  rounded'>If you already have account</span>
        <button className='bg-amber-300 p-1 rounded hover:bg-red-600' onClick={goToLogin}>Login</button>
      </div>
    </div>
  )
}

export default Chooseregister
