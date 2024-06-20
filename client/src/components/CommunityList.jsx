import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardFooter,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
} from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CommunityList() {
  const [memberCommunities, setMemberCommunities] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const [owners, setOwners] = useState([]);
  const [memberOwners, setmemberOwners] = useState([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunityList();
  }, []);

  const fetchCommunityList = async () => {
    try {
      const adminData = localStorage.getItem("user_creds");
      const adminData1 = JSON.parse(adminData);
      const admin = adminData1._id;
      const response = await axios.get(
        `http://127.0.0.1:5000/community_list/${admin}`
      );
      setCommunityList(response.data.communityList);
      setMemberCommunities(response.data.memberCommunities);
      setOwners(response.data.owners);
      setmemberOwners(response.data.memberOwners);
    } catch (error) {
      setError("An error occurred while fetching community list");
    }
  };

  const handleCreateCommunity = async () => {
    if (!title || !description) {
      return toast.error("Please fill in all the fields!");
    }
    const adminData = localStorage.getItem("user_creds");
    const adminData1 = JSON.parse(adminData);
    const admin = adminData1._id;
    const response = await axios.post(
      "http://127.0.0.1:5000/create_community",
      {
        adminId: admin,
        communityName: title,
        communityDescription: description,
        memberIds: [admin],
      }
    );
    if (response.data.message == "Community created successfully") {
      await fetchCommunityList();
      toast.success("Community created successfully!");
    }
    setTitle("");
    setDescription("");
  };

  const handleJoinCommunity = async (index) => {
    const communityId = communityList[index]._id;
    const adminData = localStorage.getItem("user_creds");
    const adminData1 = JSON.parse(adminData);
    const admin = adminData1._id;
    const response = await axios.post(`http://127.0.0.1:5000/join_community`, {
      communityId: communityId,
      userId: admin,
    });
    if (response.data.message == "User joined successfully") {
      await fetchCommunityList();
      toast.success("Community joined successfully!");
    }
  };

  return (
    <div className="min-h-screen w-[80%] ml-[20%] p-5 bg-gray-100">
      <h1 className="text-purple1 font-bold text-xl mb-1 font-mont">
        Your Communities
      </h1>
      {!memberCommunities.length && (
        <span className="py-1 px-4 rounded-full bg-red-200 text-red-600">
          No communities joined yet!
        </span>
      )}
      <div className="grid grid-cols-3 gap-5 2xl:grid-cols-4 2xl:gap-3">
        {memberCommunities.map((community, index) => (
          <Card
            isFooterBlurred
            key={index}
            className="transition-all font-mont w-full h-[19rem] p-5 bg-gradient-to-r from-purple1 to-cyan-900 flex flex-col justify-between hover:shadow-xl transform hover:scale-105"
          >
            <CardHeader className="flex-col items-start space-y-1">
              <h4 className="text-white font-bold text-xl">
                {community.communityName}
              </h4>
              <p className="text-sm text-white/60 font-semibold">
                Created by: {memberOwners[index]}
              </p>
            </CardHeader>
            <CardFooter className="h-[60%] rounded-t-xl bg-gray-400/20 flex flex-col justify-between items-start">
              <div className="text-gray-50 max-h-[5rem] w-full text-sm text-wrap truncate">
                {community.communityDescription}
              </div>
              <div
                onClick={() => navigate(`/forum/${community._id}`)}
                className="bg-gray-200 flex justify-center items-center cursor-pointer rounded-full w-[40%] self-center text-sm text-black font-bold px-1 py-1 transition-all transform hover:scale-105"
              >
                Visit
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <h1 className="text-purple1 font-bold text-xl mb-1 font-mont mt-10">
        Explore Communities
      </h1>
      <div className="grid grid-cols-3 gap-5 2xl:grid-cols-4 2xl:gap-3">
        {communityList.map((community, index) => (
          <Card
            isFooterBlurred
            key={index}
            className="transition-all font-mont w-full h-[19rem] p-5 bg-gradient-to-r from-purple1 to-cyan-900 flex flex-col justify-between hover:shadow-xl transform hover:scale-105"
          >
            <CardHeader className="flex-col items-start space-y-1">
              <h4 className="text-white font-bold text-xl">
                {community.communityName}
              </h4>
              <p className="text-sm text-white/60 font-semibold">
                Created by: {owners[index]}
              </p>
            </CardHeader>
            <CardFooter className="h-[60%] rounded-t-xl bg-gray-400/20 flex flex-col justify-between items-start">
              <div className="text-gray-50 max-h-[5rem] w-full text-sm text-wrap truncate">
                {community.communityDescription}
              </div>
              <button
                onClick={() => handleJoinCommunity(index)}
                className="bg-gray-200 hover:bg-gray-300 flex justify-center items-center cursor-pointer rounded-full w-[40%] self-center text-sm text-black font-bold px-1 py-1 transition-all transform hover:scale-105"
              >
                Join
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Button
        color="default"
        className="fixed shadow-xl text-slate-900 border border-gray-400 bottom-5 right-5 font-mont text-md font-semibold rounded-full transition-all transform hover:scale-105"
        onPress={onOpen}
      >
        + Create Community
      </Button>
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
                Create Your Own Community!
              </ModalHeader>
              <ModalBody className="flex flex-col space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Community Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Community Title"
                    className="mt-1 block w-full py-2 px-3 border-2 bg-white border-gray-200 rounded-xl shadow-sm hover:border-gray-400 focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Brief Description
                  </label>
                  <Textarea
                    id="description"
                    minRows={2}
                    maxRows={3}
                    variant="bordered"
                    className="mt-1 block w-full bg-white rounded-xl sm:text-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"
                    placeholder="Ask a question"
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
                  onClick={handleCreateCommunity}
                  onPress={onClose}
                >
                  Create
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

export default CommunityList;
