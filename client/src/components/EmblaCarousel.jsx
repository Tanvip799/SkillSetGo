import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Progress } from "@nextui-org/react";
import ReactLogo from "../assets/react-logo.jpg";
import mlLogo from "../assets/ml-logo.png";
import { Chip } from "@nextui-org/react";

export const EmblaCarousel = () => {
  return (
    <>
      <div>
        <div className="flex space-x-2">
          <h1 className="text-purple1 font-bold text-xl mb-1 font-mont">
            Courses
          </h1>
          <Link to="/courses">
            <Chip
              size="sm"
              variant="flat"
              color="secondary"
            >
              View All
            </Chip>
          </Link>
        </div>
        <div className="courses w-[37rem] h-[19rem] flex justify-between items-center">
          <Link
            to=""
            className="w-[18rem] p-3 bg-white shadow-lg rounded-lg h-[100%] flex flex-col items-start justify-between hover:bg-slate-100"
          >
            <img
              src={ReactLogo}
              className="object-cover h-[12rem] rounded-lg"
              alt=""
            />
            <p className="font-semibold font-mont text-lg">
              React Complete Course
            </p>
            Progress:
            <Progress color="default" aria-label="Loading..." value={60} />
          </Link>

          <Link
            to=""
            className="w-[18rem] p-3 bg-white shadow-lg rounded-lg h-[100%] flex flex-col items-start justify-between hover:bg-slate-100"
          >
            <img
              src={mlLogo}
              className="object-cover h-[12rem] rounded-lg"
              alt=""
            />
            <p className="font-semibold font-mont text-lg">
              Machine Learning Course
            </p>
            Progress:
            <Progress color="warning" aria-label="Loading..." value={20} />
          </Link>
        </div>
      </div>
    </>
  );
};
