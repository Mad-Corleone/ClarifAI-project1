import { useState } from "react";
import axios from "axios";

function App() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setChat((prev) => [...prev, userMessage]);

    setLoading(true);

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/chat",
        {
          text: message,
        }
      );

      const aiMessage = {
        sender: "ai",
        text: response.data.reply,
        sentiment: response.data.sentiment,
        context: response.data.context_used,
      };

      setChat((prev) => [...prev, aiMessage]);

    } catch (error) {

      console.error(error);

    }

    setMessage("");
    setLoading(false);
  };

  const uploadDocument = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData
      );

      setUploadMessage(response.data.message);

    } catch (error) {

      setUploadMessage("Upload failed");

    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden">

      {/* Background Blur */}
      <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 top-10 left-10 animate-pulse"></div>

      <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 bottom-10 right-10 animate-pulse"></div>

      {/* Header */}
      <div className="text-center pt-10 relative z-10">

        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          ClarifAI
        </h1>

        <p className="text-slate-400 mt-4 text-lg">
          Offline AI Support System for Jaideep General Store
        </p>

      </div>

      {/* Upload */}
      <div className="flex justify-center mt-8 relative z-10">

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-[500px] shadow-2xl">

          <h2 className="text-xl mb-4 font-semibold">
            Upload Business Documents
          </h2>

          <input
            type="file"
            onChange={uploadDocument}
            className="w-full"
          />

          <p className="text-green-400 mt-3">
            {uploadMessage}
          </p>

        </div>

      </div>

      {/* Chat */}
      <div className="max-w-5xl mx-auto mt-10 relative z-10">

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl h-[500px] overflow-y-auto p-6 shadow-2xl">

          <div className="flex flex-col gap-4">

            {chat.map((msg, index) => (

              <div
                key={index}
                className={`p-4 rounded-2xl max-w-[70%] transition-all duration-300 ${
                  msg.sender === "user"
                    ? "self-end bg-blue-600"
                    : "self-start bg-slate-800"
                }`}
              >

                <p>{msg.text}</p>

                {msg.sender === "ai" && (

                  <>
                    <div className="mt-3 inline-block bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                      Sentiment: {msg.sentiment}
                    </div>

                    <div className="mt-3 bg-black/30 p-3 rounded-xl text-sm text-slate-300">
                      <strong>RAG Context:</strong>
                      <p>{msg.context}</p>
                    </div>
                  </>
                )}

              </div>
            ))}

            {loading && (

              <div className="self-start bg-slate-800 p-4 rounded-2xl animate-pulse">
                ClarifAI is analyzing your request...
              </div>
            )}

          </div>

        </div>

        {/* Input */}
        <div className="mt-6 flex gap-4">

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask ClarifAI..."
            className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white resize-none h-24 focus:outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;