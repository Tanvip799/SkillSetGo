import React, { useState, useRef, useEffect } from "react";
import backgroundImage from "../assets/mountains.jpg"; // Add your background image path here
import {CircularProgress} from "@nextui-org/react";

function PomodoroTimer() {
  const [time, setTime] = useState(1500); // Initial time set to 25 minutes (1500 seconds)
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, time]);

  const increaseTime = () => {
    setTime((prevTime) => prevTime + 60);
  };

  const decreaseTime = () => {
    if (time > 1500) {
      setTime((prevTime) => prevTime - 60);
    }
  };

  const startTimer = () => {
    setLimit(time);
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(1500); // Reset to initial 25 minutes
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <>
      <div>
        <h1 className="text-xl text-purple1 font-bold font-mont mb-1">Timer</h1>
        <div
          className="pomodoro-timer flex flex-col items-center justify-center p-6 pt-7 bg-cover bg-center rounded-lg shadow-lg text-white w-[18rem] h-[19rem]"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="time-display text-5xl font-mont font-bold mb-6">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
          <div className="time-controls flex justify-center mb-6 bg-transparent border-white border-2 rounded-lg">
            <button
              className="text-white w-[50%] font-extrabold py-2 px-4 rounded-lg hover:bg-gray-700"
              onClick={decreaseTime}
            >
              -
            </button>
            <button
              className="text-white w-[50%] font-extrabold py-2 px-4 rounded-lg hover:bg-gray-700"
              onClick={increaseTime}
            >
              +
            </button>
          </div>
          <div className="timer-controls flex justify-between space-x-3 mb-6">
            <button
              className="bg-transparent border-white border-2 hover:opacity-60 text-white font-semibold py-2 px-4 rounded-lg"
              onClick={startTimer}
            >
              Start
            </button>
            <button
              className="bg-transparent border-white border-2 hover:opacity-60 font-semibold py-2 px-4 rounded-lg"
              onClick={stopTimer}
            >
              Stop
            </button>
            <button
              className="bg-transparent border-white border-2 hover:opacity-60 text-white font-semibold py-2 px-4 rounded-lg"
              onClick={resetTimer}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PomodoroTimer;
