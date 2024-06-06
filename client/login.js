function onSubmitForm(event) {
    // prevent default submit event 
    event.preventDefault();

    // get field values
    let usernameVal = document.getElementById("username").value
    let passwordVal = document.getElementById("password").value
    
    // pack values into dto
    let dto = {username: usernameVal, password: passwordVal}
    
    // log values to debug
    console.log(dto.password)
    console.log(dto.username)

    // AJAX request to backend to login
    $.ajax({
        url: '/login',
        type: 'POST',
        contentType: 'application/json',
        data: `${JSON.stringify(dto)}`,
        success: response => {
            console.log(response);
            let resObj = JSON.parse(response)
            console.log(resObj)
            sessionStorage.setItem('displayname', `${resObj.displayname}`)
            document.getElementById("myloginform").reset();
            window.location.href = "/"
        },
        error: (xhr, status, error) => {
            console.error("Fehler ", error)
        }
    })
}

// cancel button function
function cancel(){
    document.getElementById("myloginform").reset();
    window.location.href = "http://127.0.0.1:3000"
}

