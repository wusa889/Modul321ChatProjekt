// The websocket object is created by the browser and is used to connect to the server.
// Think about it when the backend is not running on the same server as the frontend
// replace localhost with the server's IP address or domain name.
const socket = new WebSocket("ws://localhost:3000");

// Listen for WebSocket open event
socket.addEventListener("open", (event) => {
  console.log("WebSocket connected.");
  // Send a dummy user to the backend
  const user = { id: 1, name: "John Doe" };
  const message = {
    type: "user",
    user,
  };
  sessionStorage.setItem('user', 'John Doe')
  socket.send(JSON.stringify(message));
});

const createMessage = (message) => {
  let test = JSON.parse(message);
  console.log(test)
  console.log(test.text)
  const p = document.createElement("p");
  p.textContent = test.text;
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
  document.getElementById("btnSendHello").addEventListener("click", () => {
    const message = {
      type: "message",
      text: "Hello, server!",
    };
    socket.send(JSON.stringify(message));
  });
  document.getElementById("btnTest").addEventListener("click", () => {
    const msgValue = document.getElementById("chatbox")
    const user = sessionStorage.getItem('user')
    const message = {
      type: "message",
      text: `${user}: ${msgValue.value}`,
    };
    socket.send(JSON.stringify(message));
    msgValue.value = ""
  });
});
