import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { EmblaCarousel } from './EmblaCarousel'
import TodoList from './TodoList'
import PomodoroTimer from './PomodoroTimer'
// import { useAuth } from '../AuthContext';

function Home() {
  const navigate = useNavigate();
  // const { isAuthenticated } = useAuth(); // Use useAuth hook

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/'); // Redirect to home if authenticated
  //   } else {
  //     navigate('/login'); // Otherwise, redirect to login
  //   }
  // }, [isAuthenticated]);

  useEffect(() => {
    const token = localStorage.getItem('user_creds');
    if (!token) {
      navigate('/login');
    }
  }, []);

  return (
    <div className="min-h-screen w-[80%] ml-[20%] p-5 bg-gray-100">
      <div className="w-[100%] grid grid-rows-2 grid-cols-3 gap-x-5 gap-y-6">
        <div className="col-span-2 row-span-1">
          <EmblaCarousel />
        </div>
        <div className="col-span-1 row-span-2">
          <TodoList />
        </div>
        <div className='col-span-1 row-span-1'>
          <PomodoroTimer />
        </div>
      </div>
    </div>
  )
}

export default Home
