import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import ThumbsUp from "../assets/thumbs-up.png";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DoubtPage() {
  const [responses, setResponses] = useState([]);
  const [commentors, setCommentors] = useState([]);
  const [isLiked, setIsLiked] = useState([]);
  const [description, setDescription] = useState("");
  const [doubtData, setDoubtData] = useState({});
  const [doubtAsker, setDoubtAsker] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { communityId, doubtId } = useParams();
  const navigate = useNavigate();

  const adminData = localStorage.getItem("user_creds");
  const adminData1 = JSON.parse(adminData);
  const admin = adminData1._id;

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    const response = await axios.get(
      `http://127.0.0.1:5000/get_responses/${doubtId}/${admin}`
    );
    setResponses(response.data.responses);
    setCommentors(response.data.commentors);
    setIsLiked(response.data.isLiked);
    setDoubtData(response.data.parentComment);
    setDoubtAsker(response.data.doubtAsker);
  };

  const handleAnswerDoubt = async () => {
    if (!description) {
      toast.error("Please provide a solution before submitting");
      return;
    }
    const response = await axios.post("http://127.0.0.1:5000/answer_doubt", {
      communityId: communityId,
      commentHeading: "",
      commentContent: description,
      commentorId: admin,
      parentId: doubtId,
      reply: null,
    });
    if (response.status === 200) {
      fetchResponses();
      toast.success("Answered successfully!");
      setDescription("");
    } else {
      toast.error("An error occurred while adding your solution");
    }
  };

  const handleDeleteResponse = async (event, responseId) => {
    event.preventDefault();
    try {
      const response = await axios.delete(
        `http://127.0.0.1:5000/delete_comment/${responseId}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.status === 200) {
        fetchReplies();
        toast.success("Response deleted successfully!");
      } else {
        console.error("Error response:", response);
        toast.error("An error occurred while deleting your response");
      }
    } catch (error) {
      console.error("Error deleting response:", error);
      toast.error("An error occurred while deleting your response");
    }
  };


  const handleLike = async (event, index) => {
    event.stopPropagation();
    event.preventDefault();
    const commentId = responses[index]._id;
    const response = await axios.post("http://127.0.0.1:5000/like_doubt", {
      commentId: commentId,
      like: true,
      userId: admin,
    });
    if (response.status === 200) {
      fetchResponses();
    }
  };

  const handleRemoveLike = async (event, index) => {
    event.stopPropagation();
    event.preventDefault();
    const commentId = responses[index]._id;
    const response = await axios.post("http://127.0.0.1:5000/like_doubt", {
      commentId: commentId,
      like: false,
      userId: admin,
    });
    if (response.status === 200) {
      fetchResponses();
    }
  };

  return (
    <div className="min-h-screen w-[80%] ml-[20%] p-5 px-8 bg-white">
      <div className="flex justify-between items-start">
        <h1 className="text-purple1 text-xl font-mont font-bold py-2">Doubt :</h1>
        <button
          onClick={onOpen}
          className="bg-purple1 hover:bg-purple-700 transition-all font-pop text-white px-4 py-2 rounded-full text-sm"
        >
          Add Your Answer
        </button>
      </div>
      <div className="bg-gray-100 shadow-md mt-2 mb-6 rounded-xl p-3 flex flex-col items-start relative">
        <div className="flex items-center">
          <div className="bg-[#1E1A1D] text-white rounded-full h-7 w-7 flex justify-center items-center">
            {doubtAsker.charAt(0).toUpperCase()}
          </div>
          <p className="text-gray-700 ml-2 font-semibold text-sm font-mont">
            {doubtAsker}
          </p>
        </div>
        <h1 className="font-bold text-lg font-mont text-ellipsis mt-1 max-w-full text-wrap">
          {doubtData.commentHeading}
        </h1>
        <pre
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: "500",
            maxWidth: "100%",
            fontSize: "0.95rem",
            color: "#4B5563",
          }}
        >
          {doubtData.commentContent}
        </pre>
      </div>
      <h1 className="text-purple1 text-xl font-mont font-bold">Responses :</h1>
      {responses.map((response, index) => (
        <Link
          onClick={() => navigate(`/forum/${communityId}/${doubtId}/${response._id}`)}
          className="bg-gray-100 shadow-md mb-6 rounded-xl p-3 flex flex-col items-start relative hover:scale-105 transition-all cursor-pointer"
          key={response._id}
        >
          {response.commentorId === admin && (
            <Dropdown>
              <DropdownTrigger>
                <button
                  onClick={(event) => event.preventDefault()}
                  className="absolute top-2 right-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-ellipsis-vertical"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Action event example"
                onAction={(key) => alert(key)}
              >
                <DropdownItem
                  onClick={(event) => handleDeleteResponse(event, response._id)}
                  key="delete"
                  className="text-danger"
                  color="danger"
                >
                  Delete response
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
          <div className="flex items-center">
            <div className="bg-[#1E1A1D] text-white rounded-full h-7 w-7 flex justify-center items-center">
              {commentors[index].charAt(0).toUpperCase()}
            </div>
            <p className="text-gray-700 ml-2 font-semibold text-sm font-mont">
              {commentors[index]}
            </p>
          </div>
          <pre
            style={{
              fontFamily: "Montserrat, sans-serif",
              maxWidth: "100%",
              textOverflow: "wrap",
              fontWeight: "500",
              fontSize: "0.95rem",
              color: "#111827",
              marginTop: "0.5rem",
            }}
          >
            {response.commentContent}
          </pre>
          <div className="flex items-end">
            <div className="flex items-center mt-2">
              <button
                onClick={(event) =>
                  isLiked[index]
                    ? handleRemoveLike(event, index)
                    : handleLike(event, index)
                }
                className="likeBtn h-7 w-7 p-1 flex justify-center items-center rounded-xl hover:bg-gray-400"
              >
                {isLiked[index] ? (
                  <img src={ThumbsUp} alt="Liked" className="h-5 w-5" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-thumbs-up h-5 w-5"
                  >
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                )}
              </button>

              <div className="flex ml-[-0.6rem] h-7 w-7 p-1 justify-center items-center text-xs font-pop">
                {response.likes}
              </div>
            </div>

            <div className="flex items-center ml-2">
              <div onClick={() => navigate(`/forum/${communityId}/${doubtId}/${response._id}`)} className="h-7 p-1 flex justify-center items-center rounded-xl hover:bg-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-message-square-text h-5 w-5"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M13 8H7" />
                  <path d="M17 12H7" />
                </svg>

                <p className="text-sm font-pop ml-1">View Replies</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
      <Modal
        backdrop="blur"
        className="font-mont"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center font-bold">
                Give Your Solution
              </ModalHeader>
              <ModalBody className="flex flex-col space-y-4">
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Solution :
                  </label>
                  <Textarea
                    id="description"
                    minRows={16}
                    maxRows={18}
                    variant="bordered"
                    className="mt-1 block w-full bg-white rounded-xl sm:text-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"
                    placeholder="Provide your solution here..."
                    required
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onClick={(event) => handleAnswerDoubt(event)}
                  onPress={onClose}
                >
                  Answer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default DoubtPage;
