import { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input) return;
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, type: "user" }
    ]);
    setInput("");

    const query = input.replace(/\s+/g, "+");
    try {
      const response = await fetch(`http://127.0.0.1:5000/query/${query}`);
      const data = await response.json();
      const message = await data.top.res;
      console.log({ message });
    // Check if the response contains date or time-related keywords
    if (
      message.toLowerCase().includes("date") ||
      message.toLowerCase().includes("time")
    ) {
      const currentDateTime = new Date().toLocaleString();
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message.replace("{datetime}", currentDateTime), type: "bot" }
      ]);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, type: "bot" }
      ]);
    }
  } catch (err) {
    console.log("error ", err);
  }
};

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          flex: 1,
          overflow: "scroll",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              alignSelf: message.type === "user" ? "flex-start" : "flex-end",
              backgroundColor: message.type === "user" ? "#b3d9ff" : "#ccf5ff",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "10px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              maxWidth: "70%",
            }}
          >
            <span style={{ color: "#333333" }}>{message.text}</span>
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", marginTop: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            marginRight: "10px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
          }}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "10px",
            cursor: "pointer",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
