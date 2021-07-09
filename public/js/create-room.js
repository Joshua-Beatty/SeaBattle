passwordTextbox = document.getElementById('password3');
passwordTextbox.disabled=true;
passwordTextbox.value="";
passwordCheckbox = document.getElementById('password2');
passwordCheckbox.checked=false;
warning = document.getElementById('form-warning');
roomName = document.getElementById('room-name1');

async function formSubmit(){
    roomName.value = roomName.value.trim()
    warning.innerHTML = "";
    if(passwordCheckbox.checked && passwordTextbox.value == ""){
        warning.innerHTML = "Password can not be empty";
        return;
    }

    if(/[^A-Za-z\d\s]/.test(roomName.value)){
        warning.innerHTML = "Room Name can only contain letters, numbers, and spaces";
        return;
    }    

    if(/[^A-Za-z\d]/.test(passwordTextbox.value)){
        warning.innerHTML = "Password can only contain letters and numbers";
        return;
    }

    
    if(roomName.value.length < 4){
        warning.innerHTML = "Room Name must be at least four characters";
        return;
    }
    if(roomName.value.length  > 25){
        warning.innerHTML = "Room Name must be less then 25 characters";
        return;
    }
    
    Cookies.set('pw', passwordTextbox.value)
    window.location.href=`/play?RoomName=${roomName.value}`;
}