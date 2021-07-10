passwordTextbox = document.getElementById('password3');
tableBody = document.getElementById('table-tbody');
updateTable();
function formSubmit(){
    fetch(window.location.origin + `/auth?RoomName=${highlighted.getAttribute("id")}&pw=${passwordTextbox.value}`).then(function(response) {
        return response.json();
      }).then(function(data) {
          console.log(data)
          if(data.length == 1){
            Cookies.set('pw', passwordTextbox.value)
            window.location.href=`/play?RoomName=${highlighted.getAttribute("id")}`;
          }
      }).catch(function(error) {
        console.log(error);
      });
}


function updateTable(){
    tableBody.innerHTML = "" 
    fetch(window.location.origin + "/open-rooms").then(function(response) {
        return response.json();
      }).then(function(data) {
        tableBody.innerHTML = ""
        data.forEach(function(v){
            tableBody.innerHTML += `
            <tr class="tableRow" id="${v.RoomName}" onclick="highlight(this.id)">
                <td>${ v.RoomName}</td>
                <td>${ v.password == "yes" ? "🔐" : "🔓"}</td>
            </tr>`
        });
      }).catch(function() {
        console.log("Error");
      });
}
var highlighted = ""

function highlight(id){
    if(highlighted != document.getElementById(id)){
        if(highlighted != ""){
        highlighted.classList.remove("highlight");
    }
        highlighted = document.getElementById(id);
        highlighted.classList.add("highlight");
        passwordTextbox.disabled = true;
        passwordTextbox.value = "";
        for (var i = 0; i < highlighted.childNodes.length; i++) {
            if (highlighted.childNodes[i].innerHTML == "🔐") {
                passwordTextbox.disabled = false;
            break;
            }        
        }
    }

}