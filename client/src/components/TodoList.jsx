import React, { useState, useEffect } from "react";
import axios from "axios";
import Trash from "../assets/trash.png";

const ToDoList = () => {
  const [tasks, setTasks] = useState({
    academics: [],
    extraCurriculum: [],
    others: [],
  });

  const [newTask, setNewTask] = useState({
    academics: "",
    extraCurriculum: "",
    others: "",
  });

  useEffect(() => {
    const adminData = localStorage.getItem("user_creds");
    const adminData1 = JSON.parse(adminData);
    const admin = adminData1._id;

    axios.get(`http://127.0.0.1:5000/get_todo_list/${admin}`)
      .then(response => {
        const todoList = response.data.todoList;
        const updatedTasks = { academics: [], extraCurriculum: [], others: [] };
        todoList.forEach(item => {
          updatedTasks[item.category].push(item.text);
        });
        setTasks(updatedTasks);
      })
      .catch(error => {
        console.error("Error fetching todo list:", error);
      });
  }, []);

  const handleAddTask = (category) => {
    const adminData = localStorage.getItem("user_creds");
    const adminData1 = JSON.parse(adminData);
    const admin = adminData1._id;

    if (newTask[category]) {
      const task = newTask[category];
      axios.post("http://127.0.0.1:5000/add_todo", {
        userId: admin,
        text: task,
        category: category
      })
      .then(response => {
        setTasks({
          ...tasks,
          [category]: [...tasks[category], task],
        });
        setNewTask({ ...newTask, [category]: "" });
      })
      .catch(error => {
        console.error("Error adding task:", error);
      });
    }
  };

  const handleDeleteTask = (category, index) => {
    const updatedTasks = tasks[category].filter((_, i) => i !== index);
    setTasks({ ...tasks, [category]: updatedTasks });
  };

  return (
    <div className="w-[100%]">
      <h1 className="text-xl text-purple1 font-bold font-mont mb-1">
        Todo List
      </h1>
      <div className="bg-white shadow-lg rounded-lg p-6 mx-auto overflow-auto">
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
                className="flex-grow p-2 border border-gray-400 rounded-l-md bg-white"
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
