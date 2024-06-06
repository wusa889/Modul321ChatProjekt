// The websocket object is created by the browser and is used to connect to the server.
// Think about it when the backend is not running on the same server as the frontend
// replace localhost with the server's IP address or domain name.
const socket = new WebSocket("ws://localhost:3000");

// Listen for WebSocket open event
socket.addEventListener("open", (event) => {
  console.log("WebSocket connected.");
  //Send a dummy user to the backend
  const user = { id: 1, name: "John Doe" };
  const message = {
    type: "user",
    user,
  };
  socket.send(JSON.stringify(message));
});

const createMessage = (message) => {
  let content = JSON.parse(message);
  const p = document.createElement("p");
  let textToPrint;
  switch (content.type) {
    case "user":
      textToPrint = `${content.type}: ${content.user.name} `;
      p.textContent = textToPrint;
      break;

    case "message":
      if (content.text === "") {
        break;
      }
      textToPrint = `${content.user}: ${content.text} `;
      p.textContent = textToPrint;
      break;
  }
  console.log("createt p");
  document.getElementById("messages").appendChild(p);
};

// Listen for messages from server
socket.addEventListener("message", (event) => {
  console.log(`Received message: ${event.data}`);
  createMessage(event.data);
});

// Listen for WebSocket close event
socket.addEventListener("close", (event) => {
  console.log("WebSocket closed.");
});

// Listen for WebSocket errors
socket.addEventListener("error", (event) => {
  console.error("WebSocket error:", event);
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnTest").addEventListener("click", () => {
    const msgValue = document.getElementById("chatbox");
    if (msgValue.value.trim() === "") {
      // If the message is empty, do nothing
      return;
    }
    const user = sessionStorage.getItem("displayname") || "Anonymous";
    const message = {
      type: "message",
      text: msgValue.value,
      user: user,
    };
    socket.send(JSON.stringify(message));
    msgValue.value = ""; // Clear the input box after sending the message
  });
});
