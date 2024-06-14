function onSubmitForm(event) {
    // prevent default submit event 
    event.preventDefault();

    // get field values
    let usernameVal = document.getElementById("username").value;
    let passwordVal = document.getElementById("password").value;
    
    // pack values into dto
    let dto = { username: usernameVal, password: passwordVal };
    
    // AJAX request to backend to login
    $.ajax({
        url: '/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dto),
        success: response => {
            let resObj = response;
            sessionStorage.setItem('displayname', resObj.displayname);
            sessionStorage.setItem('token', resObj.token);
            sessionStorage.setItem('id', resObj.id);
            document.getElementById("myloginform").reset();
            window.location.href = "/";
        },
        error: (xhr, status, error) => {
            console.error("Error: ", error);
        }
    });
}

// cancel button function
function cancel() {
    document.getElementById("myloginform").reset();
    window.location.href = "/";
}
