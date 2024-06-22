import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Progress, Chip } from "@nextui-org/react";
import Study1 from "../assets/study1.png";
import Study2 from "../assets/study2.jpg";

export const EmblaCarousel = () => {
  return (
    <>
      <div className="w-[100%]">
        <div className="flex space-x-2">
          <h1 className="text-purple1 font-bold text-xl mb-1 font-mont">
            Courses
          </h1>
          <Link to="/courses">
            <Chip size="sm" variant="flat" color="secondary">
              View All
            </Chip>
          </Link>
        </div>
        <div className="courses h-[20rem] flex justify-between space-x-6 items-center">
          <Link
            to=""
            className="p-3 w-1/2 bg-white shadow-lg rounded-lg h-[100%] flex flex-col items-start justify-between hover:bg-gray-50 hover:scale-105 transition-all"
          >
            <img
              src={Study1}
              className="object-cover w-full h-[12rem] rounded-lg"
              alt=""
            />
            <p className="font-semibold font-mont text-lg text-black">
              React Complete Course
            </p>
            <p className="text-black">Progress:</p>
            <Progress classNames={{indicator: "bg-gradient-to-r from-purple1 to-purple-900"}} aria-label="Loading..." value={60} />
          </Link>

          <Link
            to=""
            className="p-3 w-1/2 bg-white shadow-lg rounded-lg h-[100%] flex flex-col items-start justify-between hover:bg-gray-50 hover:scale-105 transition-all"
          >
            <img
              src={Study2}
              className="object-cover w-full h-[12rem] rounded-lg"
              alt=""
            />
            <p className="font-semibold font-mont text-lg text-black">
              Machine Learning Course
            </p>
            <p className="text-black">Progress:</p>
            <Progress classNames={{indicator: "bg-gradient-to-r from-sky-500 to-sky-300"}} aria-label="Loading..." value={20} />
          </Link>
        </div>
      </div>
    </>
  );
};
