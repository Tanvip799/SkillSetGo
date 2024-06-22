import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import YouTube from "react-youtube";

function VideoPage() {
  const admin = JSON.parse(localStorage.getItem("user_creds"))._id;
  const { moduleId, subtopicIndex } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [material, setMaterial] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/get_vids/${moduleId}/${admin}/${subtopicIndex}`
      );
      setTitle(response.data.moduleMain.subtopic);
      setDescription(response.data.moduleMain.description);
      setVideoLink(response.data.subtopics.video_data[Number(subtopicIndex)][2]);
      setMaterial(response.data.moduleMain.links);
    } catch (error) {
      console.error(error);
    }
  };

  const getVideoId = (url) => {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("v");
  };

  const opts = {
    height: "390",
    width: "100%", // Make the video player responsive
    playerVars: {
      autoplay: 0, // Disable autoplay
    },
  };

  return (
    <div className="min-h-screen w-[80%] ml-[20%] p-5 bg-gray-100 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-purple1 font-bold text-3xl mb-4">{title}</h1>
          <p className="text-gray-700 text-lg mb-6">{description}</p>
          <div className="embed-responsive aspect-w-16 aspect-h-9 mb-6">
            {videoLink && <YouTube videoId={getVideoId(videoLink)} opts={opts} />}
          </div>
          <h2 className="text-purple1 font-bold text-2xl mb-4">Additional Resources</h2>
          <ul className="text-gray-700">
            {material.map((link, index) => (
              <li key={index} className="mb-1">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:underline"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default VideoPage;
