// From https://stackoverflow.com/a/260880
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

var username = Scratch.LoggedInUser.attributes.username;
var csrfToken = readCookie("scratchcsrftoken");

var studios = document.querySelectorAll(".gallery.thumb a.image");
for (var i = 0; i < studios.length; i++) {
  var studio = studios[i];
  var studioStats = studio.querySelector(".stats");
  var studioId = studio.href.split("/")[4];
  
  studio.removeAttribute("href");
  var studioLeaveBtn = document.createElement("button");
  studioLeaveBtn.textContent = "Leave";
  studioLeaveBtn.dataset.id = studioId;
  
  studioLeaveBtn.addEventListener("click", function() {
    var leaveRequest = new XMLHttpRequest();
    leaveRequest.open("PUT", `https://scratch.mit.edu/site-api/users/curators-in/${this.dataset.id}/remove/?usernames=${username}`);
    leaveRequest.setRequestHeader("X-CSRFToken", csrfToken);
    leaveRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest")
    leaveRequest.send();
    leaveRequest.onreadystatechange = function() {
    	if (leaveRequest.readyState === 4) {
      	if (leaveRequest.status !== 200) {
        	alert("An error occured. Check the console for more details.");
        }
        else if (leaveRequest.status === 200) {
        	alert("Studio left!");
        }
      }
    }
  });
  studioStats.appendChild(studioLeaveBtn);
}