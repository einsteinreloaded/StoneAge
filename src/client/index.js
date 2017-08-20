console.log('this is working!!')
window.submitUsername=function(){
    var username=document.getElementById("username").value;
    var sessionId;
    UserAction(username).then(setSession).catch(handleError);
}
function UserAction(username) {
    const url = "/user";
   
    return fetch(url, {
        method : "POST",
        body: JSON.stringify({ username: username }),
        headers: new Headers({ "Content-Type": "application/json" })
    }).then(
        response => response.text() 
    )
}   

function handleError(){
    alert("Game Initialisation Failed!! Please try again");

}

function setSession(data){
    sessionId = data;
    console.log(sessionId);
    window.location.href = "/board.html";
}