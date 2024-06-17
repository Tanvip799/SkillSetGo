import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import tick from "../assets/tick.png";
import { Link } from "react-router-dom";
const mentorReasons = [
  "Expertise in the field",
  "Proven track record of success",
  "Strong communication skills",
];
const mentorReasons1 = [
  "Passionate about helping others grow",
  "Flexible scheduling",
  "Cultural fit with your values and goals",
];
<div>
  <h2 className="text-xl font-bold mb-2">Reasons to Select Mentors</h2>
  <ul>
    {mentorReasons.map((reason, index) => (
      <li key={index} className="flex items-center">
        <img src="tick.png" alt="tick" className="w-4 h-4 mr-2" />
        <span>{reason}</span>
      </li>
    ))}
  </ul>
</div>;

const MentorRecommendations = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/mentorship");
        const parsedData = JSON.parse(response.data);
        console.log(parsedData);
        setMentors(parsedData);
      } catch (err) {
        setError("Error fetching mentor recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const maxStars = 5;
    for (let i = 1; i <= maxStars; i++) {
      if (i <= rating) {
        stars.push(<span key={i}>&#9733;</span>); // Filled star
      } else {
        stars.push(<span key={i}>&#9734;</span>); // Empty star
      }
    }
    return <div className="flex text-yellow-500">{stars}</div>;
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 4));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(mentors.length - 4, prevIndex + 4));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full max-w-6xl mx-auto bg-white p-6 py-0">
      <div className="grid grid-cols-3 gap-8">
        {/* First Column */}
        <div className="col-span-1">
          <h2 className="text-2xl 2xl:text-4xl font-bold mb-8 text-purple1">
            1-on-1 Career Mentorship
          </h2>
        </div>

        {/* Second Column */}
        <div className="col-span-1 mt-4">
          <ul className="space-y-4">
            {mentorReasons.map((reason, index) => (
              <li key={index} className="flex items-center">
                <img src={tick} alt="tick" className="w-5 h-5 mr-3" />
                <span className="text-sm 2xl:text-lg text-black">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Third Column */}
        <div className="col-span-1 mt-4">
          <ul className="space-y-4">
            {mentorReasons1.map((reason, index) => (
              <li key={index} className="flex items-center">
                <img src={tick} alt="tick" className="w-5 h-5 mr-3" />
                <span className="text-sm 2xl:text-lg text-black">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mentor Recommendations Section */}
      <h2 className="text-2xl font-bold my-8 mx-10"></h2>
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto"
          >
            {mentors
              .slice(currentIndex, currentIndex + 4)
              .map((mentor, index) => (
                <div key={index} className="bg-white border rounded-lg shadow-md hover:scale-105 transition-all">
                  <img
                    src="https://www.shutterstock.com/image-photo/head-shot-handsome-millennial-30s-600nw-1854710668.jpg"
                    alt={mentor.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {mentor.name}
                    </h3>
                    <p className="text-gray-600 text-md">
                      {mentor.current_position}
                    </p>
                    <p className="text-gray-500">{mentor.current_employer}</p>
                    <hr className="my-2 2xl:my-4 border-gray-300" />
                    <p className="text-gray-600">
                      Work Experience: {mentor.work_experience}
                    </p>
                    <p className="text-gray-600">{mentor.field_of_expertise}</p>
                    <div className="flex items-center mt-0 2xl:mt-2">
                      <p className="text-gray-700 font-bold text-md">
                        {mentor.average_rating}
                      </p>
                    </div>
                    <div className="flex items-center mt-0 2xl:mt-2 gap-8">
                      {renderStars(mentor.average_rating)}
                      <Link to={`/mentorship/${mentor.id}`}>
                        <button className="text-sm 2xl:text-md ml-auto bg-purple1 text-white p-1 2xl:py-1 2xl:px-3 rounded">
                          Read more
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          className="absolute top-1/2 left-[-2.3rem] 2xl:left-0 transform -translate-y-1/2 bg-white border rounded-full p-1 shadow-md text-gray-500 mr-10"
          onClick={handlePrevious}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          className="absolute top-1/2 right-[-2.3rem] 2xl:right-0 transform -translate-y-1/2 bg-white border rounded-full p-1 shadow-md text-gray-500 ml-10"
          onClick={handleNext}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};


export default MentorRecommendations;
