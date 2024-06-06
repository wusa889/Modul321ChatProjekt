$(document).ready(() => {
  build();
});

function build() {
    const header = document.getElementById('header');
    const footer = document.getElementById('footer')
    const headerContentNotLoggedIn = `
      <div class="container mx-auto">
        <h1 class="text-2xl underline"><a href="http://127.0.0.1:3000">My Chat App</a></h1>
      </div>
      <div class="flex flex-row justify-self-end"></div>
      <a href="http://127.0.0.1:3000/Login" ><button class="bg-blue-500 rounded-xl mr-5 w-20 h-10" type="button">Login</button></a>
      <a href="http://127.0.0.1:3000/register"><button class="bg-blue-500 rounded-xl mr-10 w-20 h-10" type="button">Register</button></a>
    `;
    const footerContent = `
      <div class="container mx-auto">
      <p class="text-center">Footer</p>
    </div>
    `;
    const headerContentLoggedIn = `
    <div class="container mx-auto">
        <h1 class="text-2xl underline"><a href="http://127.0.0.1:3000">My Chat App</a></h1>
      </div>
      <div class="flex flex-row justify-self-end"></div>
      <p class="text-center mr-5">${sessionStorage.getItem('displayname')}<p>
      <button class="bg-blue-500 rounded-xl mr-10 w-20 h-10" type="button" onclick="logout()">Logout</button>
    `;

    if(sessionStorage.getItem('displayname') !== null){
      header.innerHTML += headerContentLoggedIn;
    }
    else{
      header.innerHTML += headerContentNotLoggedIn;
    }
    footer.innerHTML += footerContent
}

function logout(){
  sessionStorage.clear();
  const header = document.getElementById('header');
  header.innerHTML = null;
  window.location.href = "/"
}
