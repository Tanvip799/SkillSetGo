import React from "react";
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { EmblaCarousel } from "./CoursesTwo";
import { Tooltip } from "@nextui-org/react";
import Road from "../assets/road.png";
import Roadmap from "./Roadmap";
import Stats from "./Stats";
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
        <div className="w-[66%]">
          <EmblaCarousel />
        </div>
        <div className="w-[34%]">
          <Stats />
        </div>
      </div>
      <h1 className="text-purple1 font-bold text-xl mt-10 font-mont">Your Roadmap</h1>
      <Roadmap/>
    </div>
  );
}

export default Home;
