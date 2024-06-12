$(document).ready(() => {
  buildContent();
});
function buildContent() {
  const maincontent = document.getElementById("maincontent");
  const mainContentNotLoggedIn = `
      <h1 class="m-4 text-4xl">Welcome to the Chat App</h1>
        <h2 class="m-4 text-4xl">please login to see the chatroom</h1>
    `;
  const mainContentLoggedIn = `
    <h1 class="m-4 text-4xl">Welcome ${sessionStorage.getItem(
      "displayname"
    )}</h1>
        <button class="bg-blue-500 rounded-xl mb-5 mr-5 w-60 h-10" type="button" onclick="toChat()">to the chatroom</button></br>
        <a href="/register" ><button class="bg-blue-500 rounded-xl mr-5 w-60 h-10" type="button">change display name</button></a>
  `;

  maincontent.innerHTML = null;

  if (sessionStorage.getItem("displayname") !== null) {
    maincontent.innerHTML += mainContentLoggedIn;
  } else {
    maincontent.innerHTML += mainContentNotLoggedIn;
  }
}

function toChat() {
  var token = sessionStorage.getItem("token");
  if (token) {
    window.location.href = "/chatroom?token=" + token;
  } else {
    window.location.href = "/";
  }
}