// import { useEffect, useState } from 'react';
// import axios from 'axios';

// "use client";

// import { Card } from "flowbite-react";
// import Image from "next/image";


// const MentorRecommendations = () => {
//   const [mentor, setMentors] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchMentors = async () => {
//       try {
//         console.log('Attempting to fetch mentors...');
//         const response = await axios.get('http://localhost:5000/mentorship');
//         console.log('Mentors fetched successfully:', response.data);
//         setMentors(response.data);
//       } catch (err) {
//         console.error('Error fetching mentor recommendations:', err);
//         setError('Error fetching mentor recommendations');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMentors();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h1>Mentor Recommendations</h1>
//       <div className="w-[100%] mentor-card h-[19rem]">
//         <img src={mentor.photo} alt={mentor.name} className="mentor-photo" />
//         <h3 className="font-semibold font-mont text-lg text-black">{mentor.name}</h3>
//         <p className="font-semibold font-mont text-lg text-black">Qualification: {mentor.qualification}</p>
//         <p className="font-semibold font-mont text-lg text-black">Work Experience: {mentor.work_experience} years</p>
//         <p className="font-semibold font-mont text-lg text-black">Current Position: {mentor.current_position}</p>
//         <p className="font-semibold font-mont text-lg text-black">Current Employer: {mentor.current_employer}</p>
//         <p className="font-semibold font-mont text-lg text-black">Field of Expertise: {mentor.field_of_expertise}</p>
//         <p className="font-semibold font-mont text-lg text-black">Skills: {mentor.skills}</p>
//         <p className="font-semibold font-mont text-lg text-black">Average Rating: {mentor.average_rating}</p>
//       </div>
//     </div>
    
    
//   );
// };

// export default MentorRecommendations;
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faStarEmpty } from '@fortawesome/free-solid-svg-icons';

"use client";

const MentorRecommendations = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        console.log('Attempting to fetch mentors...');
        const response = await axios.get('http://localhost:5000/mentorship');
        console.log('Mentors fetched successfully:', response.data);
        const parsedData = JSON.parse(response.data);
        setMentors(parsedData);
      } catch (err) {
        console.error('Error fetching mentor recommendations:', err);
        setError('Error fetching mentor recommendations');
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
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-500" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="text-yellow-500" />);
        while(i<=rating){
            stars.push(<FontAwesomeIcon key={i} icon={faStarEmpty} className="text-yellow-500" />);
            i=i+1
        }
    }
}
  
    return stars;
  };
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100"> {/* Added padding */}
      <h1 className="text-center text-3xl mb-4">Mentor Recommendations</h1>
      <div className="flex flex-col items-center justify-end w-full max-w-6xl mx-auto"> {/* Updated to flex-col */}
        <div className="flex flex-row flex-wrap justify-center gap-4"> {/* Updated styles */}
          {mentors.map((mentor, index) => (
            <Card key={index} className="w-250px bg-white rounded-lg shadow-md flex-shrink-0" style={{ width: '265px', height: '380px' }}>
              <div className="flex items-center justify-center mb-4">
                <img
                  src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7SieSDnaZtBEq5mYqs-QZEOMuiED6aC6X0Q&s'
                  alt={mentor.name}
                  className="rounded-lg object-cover w-40 h-40"
                />
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold text-gray-900">{mentor.name}</h3>
                <p className="text-lg text-gray-500 dark:text-gray-400">{mentor.current_position}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{mentor.current_employer}</p>
                <p className="text-lg text-gray-600" style={{ paddingTop:'10px' }}>{mentor.field_of_expertise}</p>
                <p className="text-lg text-gray-700">{renderStars(mentor.average_rating)}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
  
};

export default MentorRecommendations;
