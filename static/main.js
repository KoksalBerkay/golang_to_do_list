var temp_id = 0;

// Click on a close button to hide the current list item
function CloseBTN() {
  var close = document.getElementsByClassName("close");
  var x;
  for (x = 0; x < close.length; x++) {
    close[x].onclick = function () {
      var div = this.parentElement;
      div.style.display = "none";
      if (div.classList.contains("checked")) {
        div.classList.remove("checked");
        div.classList.toggle("deleted");

        console.log("DIV" + div);
        var data = {
          task: div.innerHTML.split('<span class="close">×</span>')[0],
          status: div.className,
          id: parseInt(div.id),
        };
        xmlPut("/receive", data);
      } else if (div.classList.contains("not_checked")) {
        div.classList.remove("not_checked");
        div.classList.toggle("deleted");

        console.log("DIV" + div);
        var data = {
          task: div.innerHTML.split('<span class="close">×</span>')[0],
          status: div.className,
          id: parseInt(div.id),
        };
        xmlPut("/receive", data);
      }
    };
  }
}

window.onload = function () {
  xmlGet("/todos");
  CloseBTN();
};

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector("ul");
list.addEventListener(
  "click",
  function (ev) {
    if (ev.target.tagName === "LI") {
      if (ev.target.classList.contains("not_checked")) {
        ev.target.classList.remove("not_checked");
        ev.target.classList.toggle("checked");

        var data = {
          task: ev.target.innerHTML.split('<span class="close">×</span>')[0],
          status: ev.target.className,
          id: parseInt(ev.target.id),
        };
        xmlPut("/receive", data);
      } else if (ev.target.classList.contains("checked")) {
        ev.target.classList.remove("checked");
        ev.target.classList.toggle("not_checked");

        var data = {
          task: ev.target.innerHTML.split('<span class="close">×</span>')[0],
          status: ev.target.className,
          id: parseInt(ev.target.id),
        };
        xmlPut("/receive", data);
      }
    }
  },
  false
);

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === "") {
    alert("You must write something!");
  } else {
    li.classList.toggle("not_checked");
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);
  if (inputValue !== "") {
    console.log("The input value is not empty.");
    for (var i = 0; i < li.children.length; i++) {
      var data = {
        task: li.innerHTML.split('<span class="close">×</span>')[0],
        status: li.className,
        id: temp_id,
      };
      li.id = temp_id;
      temp_id += 1;

      console.log("JSON STRINGFY DATA" + JSON.stringify(data));
      xmlPost("/receive", data);
    }
  }
  CloseBTN();
}

function xmlPost(url, data) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(data));
  console.log(JSON.stringify(data));
}

function xmlPut(url, data) {
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", url, true);
  xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({ id: data.id, status: data.status }));
  console.log(JSON.stringify(data));
}

var newResponseText;

function xmlGet(url) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xhr.addEventListener("load", reqListener);
  xhr.send();
}

function reqListener() {
  console.log("Native Request Text: ", this.responseText);
  newResponseText = "[" + this.responseText + "]";
  newResponseText = JSON.parse(
    "[" + this.responseText.replace(/}\s*{/g, "},{") + "]"
  );
  console.log("New Response Text: ", newResponseText);
  document.getElementById("myUL").innerHTML = "";
  for (var i = 0; i < newResponseText.length; i++) {
    var li = document.createElement("li");
    var t = document.createTextNode(newResponseText[i].task);
    li.appendChild(t);
    li.id = newResponseText[i].id;
    li.innerHTML = newResponseText[i].task + '<span class="close">×</span>';
    if (newResponseText[i].status === "checked") {
      li.classList.toggle("checked");
      document.getElementById("myUL").appendChild(li);
    } else if (newResponseText[i].status === "not_checked") {
      li.classList.toggle("not_checked");
      document.getElementById("myUL").appendChild(li);
    }

    console.log("New Response Text ID: ", newResponseText[i].id);
    if (newResponseText[i].id > temp_id) {
      temp_id = parseInt(newResponseText[i].id) + 1;
      console.log("TEMP ID in the func: ", temp_id);
    }
    console.log("The ID of the new task in html: ", li.id);

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);
  }
  CloseBTN();
}
