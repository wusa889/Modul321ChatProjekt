// The websocket object is created by the browser and is used to connect to the server.
// Think about it when the backend is not running on the same server as the frontend
// replace localhost with the server's IP address or domain name.
const socket = new WebSocket("ws://localhost:3000");
$(document).ready(() => {
  removeTokenFromURL();
});
// Listen for WebSocket open event
socket.addEventListener("open", (event) => {
  console.log("WebSocket connected.");
  //Send the user to the backend
  const user = {id: `${sessionStorage.getItem('id')}`,  name: `${sessionStorage.getItem('displayname')}`};
  const message = {
    type: "user",
    user: user
  };
  socket.send(JSON.stringify(message));
});

const createMessage = (message) => {
  let content = JSON.parse(message);
  let p = document.createElement("p");
  let textToPrint;
  switch (content.type) {
    case "users":
      FillUserBox(content)
      if(content.id === sessionStorage.getItem("id") || content.id === undefined ){
        break;
      }
      textToPrint = `${content.text}`;
      p.textContent = textToPrint;
      document.getElementById("messages").appendChild(p);
      break;

    case "message":
      if (content.text === "") {
        break;
      }
      textToPrint = `${content.user}: ${content.text} `;
      p.textContent = textToPrint;
      document.getElementById("messages").appendChild(p);
      break;
  }
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
    const user = sessionStorage.getItem("displayname");
    const userId = sessionStorage.getItem("id");
    const message = {
      type: "message",
      text: msgValue.value,
      user: user,
      id: userId
    };
    socket.send(JSON.stringify(message));
    msgValue.value = ""; // Clear the input box after sending the message
  });
});

function findUserInArray(array, userid){
  const username = array.find(user => user.id === userid);
  return username;
}

function FillUserBox(message) {
  if (message.type !== "users") {
    return;
  }

  const userlist = document.getElementById("userlist");
  userlist.innerHTML = '';  // Clear the current user list
  message.users.forEach(user => {
    let p = document.createElement("p");
    p.textContent = user.name;
    userlist.appendChild(p);  // Append new user element
  });
}

function removeTokenFromURL() {
  const url = new URL(window.location.href);
  url.searchParams.delete('token');
  window.history.replaceState({}, document.title, url.pathname);
}