import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const MentorDetail = () => {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAssignMentor = async (e) => {
    e.preventDefault();
    const userId = JSON.parse(localStorage.getItem("user_creds"))._id;
    mentor.studentId = userId;
    try {
      const response = await axios.post(`http://127.0.0.1:5000/assign_mentor`, {
        mentorDetails: mentor,
      });
      if (response.status === 200) {
        navigate("/mentor");
      }
    } catch (err) {
      alert("Error assigning mentor");
    }
  };

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/mentorship/${id}`
        );
        setMentor(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Error fetching mentor details");
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [id]);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!mentor) return <p>Mentor not found</p>;

  return (
    <div className="max-w-5xl mx-10 my-6 p-6 bg-white shadow-lg rounded-lg font-pop">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <img
            src="https://www.shutterstock.com/image-photo/head-shot-handsome-millennial-30s-600nw-1854710668.jpg"
            alt={mentor.name}
            className="w-48 h-48 rounded-full object-cover mx-auto mb-4"
          />
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700">
              WORK EXPERIENCE
            </h3>
            <div className="mt-4">
              <p className="text-lg font-bold text-gray-900">
                {mentor.previous_employer_1}
              </p>
              <p className="text-sm text-gray-500">{mentor.address_1}</p>
            </div>
            <div className="mt-4">
              <p className="text-lg font-bold text-gray-900">
                {mentor.previous_employer_2}
              </p>
              <p className="text-sm text-gray-500">{mentor.address_2}</p>
            </div>
            <div className="mt-10">
              <p className="text-lg font-semibold text-gray-700">CONTACT</p>
              <p className="text-md text-black my-auto">
                <strong>Phone:</strong> 8756463775
              </p>
              <p className="text-md text-black my-auto">
                <strong>Email:</strong> nmbcccc@gmail.com
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="flex items-center">
            <h2 className="text-2xl 2xl:text-3xl font-bold text-black">
              {mentor.name}
            </h2>
            <span className="ml-2 text-gray-500">New York, NY</span>
          </div>
          <p className="text-md 2xl:text-lg text-gray-600">
            {mentor.current_position} at {mentor.current_employer}
          </p>
          <div className="flex items-center mt-2">
            <span className="text-lg 2xl:text-xl font-bold text-black">
              {mentor.average_rating}
            </span>
            <span className="text-2xl ml-2 text-gray-500">
              {renderStars(mentor.average_rating)}
            </span>
          </div>
          <div className="flex mt-4 space-x-4">
            <button
              onClick={(e) => handleAssignMentor(e)}
              className="text-white bg-purple1 px-4 py-2 rounded-full hover:bg-purple-900 transition-all"
            >
              Book mentor
            </button>
          </div>
          <hr className="my-8 border-t border-gray-300" />
          <div>
            <h3 className="text-xl font-bold text-black">Description</h3>
            <div className="mt-4">
              <p className="text-md 2xl:text-lg text-gray-700">
                {mentor.description}
              </p>
            </div>
          </div>
          <hr className="my-8 border-t border-gray-300" />
          <div>
            <h3 className="text-xl font-bold text-black">Skills</h3>
            <p className="text-md 2xl:text-lg text-gray-700 mt-2">
              {mentor.skills}
            </p>
          </div>
          <hr className="my-8 border-t border-gray-300" />
          <div>
            <h3 className="text-xl font-bold text-black">Expertise</h3>
            <p className="text-md 2xl:text-lg text-gray-700 mt-2">
              {mentor.field_of_expertise}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDetail;
