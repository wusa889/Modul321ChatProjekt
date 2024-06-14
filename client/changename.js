$(document).ready(() => {
    removeTokenFromURL();
});

function onSubmitForm(event) {
    // prevent default submit event 
    event.preventDefault();
    
    // get field values
    let usernameVal = document.getElementById("displayname").value
    
    // pack values into dto
    let dto = {id: sessionStorage.getItem("id"), displayname: usernameVal}

    // AJAX request to backend to register
    const token = sessionStorage.getItem('authToken');

    $.ajax({
        url: '/changename',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dto),
        headers: {
          'Authorization': `Bearer ${token}`
        },
        success: response => {
          sessionStorage.setItem('displayname', response.displayname);
          document.getElementById("displaynameform").reset();
          window.location.href = "/";
        },
        error: (xhr, status, error) => {
          console.error("Error ", error);
        }
      });
}

// cancel button function
function cancel(){
    document.getElementById("displaynameform").reset();
    window.location.href = "/"
}

function removeTokenFromURL() {
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    window.history.replaceState({}, document.title, url.pathname);
  }