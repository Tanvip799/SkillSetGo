import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Spinner } from "@nextui-org/react";
import ReactMarkdown from "react-markdown";

function Chatbot() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const lshist = window.localStorage.getItem("chatbot_history");
    if (lshist) {
      setHistory(JSON.parse(lshist));
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      window.localStorage.setItem("chatbot_history", JSON.stringify(history));
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleClear = () => {
    setHistory([]);
    setError("");
    setInput("");
    window.localStorage.setItem("chatbot_history", JSON.stringify([]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input === "") {
      setError("Please enter a question");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ history: history, message: input }),
      });
      const data = await response.text();
      console.log(data);
      setHistory((h) => [
        ...h,
        {
          role: "user",
          parts: input,
        },
        {
          role: "model",
          parts: data,
        },
      ]);
      console.log(history);
      setInput("");
      setLoading(false);
    } catch (error) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen w-[80%] ml-[20%] pt-6 px-16 bg-gray-50 flex flex-col relative">
        <h1 className="text-2xl font-bold self-center">Ask Your Doubts</h1>
        <div className="flex flex-col mt-4 mb-24 p-2 overflow-auto">
          {history.map((item, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[90%] ${
                item.role === "user"
                  ? "bg-blue-200 text-blue-900 self-end mb-2"
                  : "bg-gray-200 text-gray-900 self-start mb-10"
              }`}
            >
              <p>
                <strong>{item.role === "user" ? "You" : "AI"}:</strong>{" "}
                <ReactMarkdown>{item.parts}</ReactMarkdown>
              </p>
            </div>
          ))}
          {loading && (
            <>
              <div className="self-end mb-2 bg-blue-200 text-blue-900 p-3 rounded-lg max-w-[90%]">
                <p>
                  <p>
                    <strong>You:</strong>{" "}
                  </p>
                  {input}
                </p>
              </div>
              <Spinner
                className="self-start"
                label="Thinking"
                color="primary"
              />
            </>
          )}
          <div ref={bottomRef}></div>
        </div>
        <div className="fixed bottom-0 w-[100%] pb-4 shadow-lg">
          <div className="flex items-center space-x-2">
            <input
              className="rounded-lg w-[54%] p-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              value={input}
              onChange={handleInput}
              type="text"
              placeholder="Ask a question"
            />
            <Button onClick={handleSubmit} color="primary">
              Ask
            </Button>
            <Button color="default" onClick={handleClear}>
              Clear
            </Button>
          </div>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </div>
      </div>
    </>
  );
}

export default Chatbot;
