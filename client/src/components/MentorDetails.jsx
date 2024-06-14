import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MentorDetail = () => {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/mentors/${id}`);
        setMentor(response.data);
      } catch (err) {
        setError('Error fetching mentor details');
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!mentor) return <p>Mentor not found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center">
        <img src={mentor.photo} alt={mentor.name} className="w-20 h-20 rounded-full mr-4" />
        <div>
          <h2 className="text-2xl font-bold">{mentor.name}</h2>
          <p className="text-lg text-gray-600">{mentor.qualification}</p>
          <p className="text-lg text-gray-600">{mentor.current_position} at {mentor.current_employer}</p>
          {/* Add other personal info here */}
        </div>
      </div>
      <hr className="my-8 border-t border-gray-300" />
      <div>
        <h3 className="text-xl font-bold">Description</h3>
        <p className="text-lg text-gray-700">{mentor.description}</p>
      </div>
      <div className="my-8">
        <h3 className="text-xl font-bold">Skills</h3>
        <p className="text-lg text-gray-700">{mentor.skills}</p>
      </div>
      <div className="my-8">
        <h3 className="text-xl font-bold">Expertise</h3>
        <p className="text-lg text-gray-700">{mentor.field_of_expertise}</p>
      </div>
      {/* Add other relevant sections as needed */}
    </div>
  );
};

export default MentorDetail;
