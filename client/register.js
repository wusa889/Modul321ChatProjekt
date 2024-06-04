function onSubmitForm(event) {
    // prevent default submit event 
    event.preventDefault();
    
    // get field values
    let usernameVal = document.getElementById("username").value
    let passwordVal = document.getElementById("password").value
    let displayNameVal = document.getElementById("displayname").value
    
    // pack values into dto
    let dto = {username: usernameVal, password: passwordVal, displayname: displayNameVal}

    // log values to debug
    console.log(dto.username)
    console.log(dto.password)
    console.log(dto.displayname)

    // AJAX request to backend to register
    $.ajax({
        url: 'http://localhost:3000/login',
        type: 'POST',
        contentType: 'application/json',
        data: `${JSON.stringify(dto)}`,
        success: response => {
            console.log(response);
            sessionStorage.setItem('usernameVal', 'passwordVal')
            document.getElementById("myregisterform").reset();
        },
        error: (xhr, status, error) => {
            console.error("Fehler ", error)
        }
    })
}

// cancel button function
function cancel(){
    document.getElementById("myregisterform").reset();
    window.location.href = "http://127.0.0.1:3000"
}

