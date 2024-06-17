// src/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setMessage("All fields are required");
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:5000/register", {
        username: username,
        email: email,
        password: password,
      });
      setMessage(response.data.message);
      if (response.data.message == 'User registered successfully') {
        const loginResponse = await axios.post(`http://127.0.0.1:5000/login`, {
          email: email,
          password: password,
        });
        if (loginResponse.data.message === "User logged in successfully") {
          localStorage.setItem("user_creds", JSON.stringify(loginResponse.data.creds));
          navigate('/questions');
        }
      }
    } catch (error) {
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100">
      <div className="bg-white shadow-xl rounded-lg p-10 w-[30%] max-w-md font-mont">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </div>
        </form>
        <p className="mt-2 text-gray-800">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
