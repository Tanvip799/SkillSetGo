import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import axios from "axios";

function Mentor() {
  const [mentor, setMentor] = useState({});
  const [username, setUsername] = useState("");
  const userId = JSON.parse(localStorage.getItem("user_creds"))._id;
  const navigate = useNavigate();

  const myMeeting = async (element) => {
    const appID = 1182566435;
    const serverSecret = "23530825837b90f313f25582086bdfe3";
    const roomID = userId;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userId, username);
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zc.joinRoom({
        container: element,
        scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
        }
    })
  }

  useEffect(() => {
    fetchMentor();
  }, []);

  const fetchMentor = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/get_mentor/${userId}`
      );
      if (response.data.mentor) {
        setMentor(response.data.mentor);
        setUsername(response.data.username);
      } else {
        console.log(response.data.message);
        navigate("/mentorship");
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen w-[80%] ml-[20%] p-5 bg-gray-100">
      {mentor && 
      <div>
        {mentor.name}
    </div>}
    </div>
  );
}

export default Mentor;
