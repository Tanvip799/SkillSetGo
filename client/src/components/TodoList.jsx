import React, { useState } from "react";
import Trash from "../assets/trash.png";

const ToDoList = () => {
  const [tasks, setTasks] = useState({
    academics: ["CCN ISE 2", "DAA Lab 10"],
    extraCurriculum: ["Python Tutorial", "Learn OpenCV"],
    others: ["Buy birthday gift", "Call aunt"],
  });

  const [newTask, setNewTask] = useState({
    academics: "",
    extraCurriculum: "",
    others: "",
  });

  const handleAddTask = (category) => {
    if (newTask[category]) {
      setTasks({
        ...tasks,
        [category]: [...tasks[category], newTask[category]],
      });
      setNewTask({ ...newTask, [category]: "" });
    }
  };

  const handleDeleteTask = (category, index) => {
    const updatedTasks = tasks[category].filter((_, i) => i !== index);
    setTasks({ ...tasks, [category]: updatedTasks });
  };

  return (
    <div>
      <h1 className="text-xl text-purple1 font-bold font-mont mb-1">
        Todo List
      </h1>
      <div className="bg-white shadow-lg rounded-lg p-6 w-[20rem] max-w-md mx-auto overflow-auto h-[42rem]">
        {Object.keys(tasks).map((category) => (
          <div key={category} className="mb-6">
            <h2 className="text-lg font-semibold text-white bg-slate-400 p-2 rounded">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>
            {tasks[category].map((task, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b"
              >
                <span className="text-gray-700">{task}</span>
                <button
                  onClick={() => handleDeleteTask(category, index)}
                  className="hover:bg-gray-200 p-1 rounded-full"
                >
                  <img src={Trash} className="h-5" alt="" />
                </button>
              </div>
            ))}
            <div className="flex mt-2">
              <input
                type="text"
                placeholder="Add task here"
                value={newTask[category]}
                onChange={(e) =>
                  setNewTask({ ...newTask, [category]: e.target.value })
                }
                className="flex-grow p-2 border rounded-l-md"
              />
              <button
                onClick={() => handleAddTask(category)}
                className="bg-gray-400 text-white px-4 rounded-r-md hover:bg-gray-400"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToDoList;
