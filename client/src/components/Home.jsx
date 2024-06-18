import React from "react";
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { EmblaCarousel } from "./CoursesTwo";
import { Tooltip } from "@nextui-org/react";
import Road from "../assets/road.png";
import Roadmap from "./Roadmap";
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
    const token = localStorage.getItem("user_creds");
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen w-[80%] ml-[20%] p-5 bg-gray-100">
      <div className="w-[100%] flex space-x-4">
        <div className="w-[65%]">
          <EmblaCarousel />
        </div>
        <div className="">
          <h1 className="text-purple1 font-bold text-xl mb-1 font-mont">
            Your Stats
          </h1>
          <div className="p-3 bg-white shadow-lg rounded-lg flex flex-col justify-between items-center h-[19rem]">
            
          </div>
        </div>
      </div>
      <h1 className="text-purple1 font-bold text-xl mt-10 font-mont">Your Roadmap</h1>
      <Roadmap/>
    </div>
  );
}

export default Home;
