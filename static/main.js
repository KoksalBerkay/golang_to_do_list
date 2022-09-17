// Click on a close button to hide the current list item
function CloseBTN () {
  var close = document.getElementsByClassName("close");
  var x;
  for (x = 0; x < close.length; x++) {
    close[x].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
      if (div.classList.contains("checked")) {
        div.classList.remove("checked");
        div.classList.toggle("deleted");
        // store();
      }
      else if (div.classList.contains("not_checked")) {
        div.classList.remove("not_checked");
        div.classList.toggle("deleted");
        // store();
      }
    }
  }
}

window.onload = CloseBTN;

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {

    if (ev.target.classList.contains('not_checked')) { 
      ev.target.classList.remove('not_checked');
      ev.target.classList.toggle('checked');
      // store();
    }
    else if (ev.target.classList.contains('checked')) {
      ev.target.classList.remove('checked');
      ev.target.classList.toggle('not_checked');
      // store();
    }
  }
  store();
}, false);

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    li.classList.toggle("not_checked");
    document.getElementById("myUL").appendChild(li);
    // store();
  }
  document.getElementById("myInput").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);
  store();
  CloseBTN();
}

var data;
function store() {
  // LOCAL STORAGE
  var list = document.querySelector('ul');
  window.localStorage.myitems = list.innerHTML;

  // XML POST
  for (var i = 0; i < list.children.length; i++) {
    var item = list.children[i];
    var data = {
      "task": item.innerHTML.split("<span class=\"close\">×</span>")[0],
      "status": item.className
    };
    console.log("JSON STRINGFY DATA" + JSON.stringify(data));
    xmlPost('/receive', data);
  }
}

function getValues() {
    var storedValues = window.localStorage.myitems;
    if(!storedValues) {
      list.innerHTML = '<li class="not_checked">Go to the school <span class="close">×</span> </li>'+
                       '<li class="checked">Watch some youtube <span class="close">×</span> </li>'+
                       '<li class="not_checked">Study math <span class="close">×</span> </li>'+
                       '<li class="not_checked">Play Valorant <span class="close">×</span> </li>'+
                       '<li class="not_checked">Write some code <span class="close">×</span> </li>'+
                       '<li class="not_checked">Read a book <span class="close">×</span> </li>';
    }
    else {
      list.innerHTML = storedValues;
    }
  }
  
getValues();

function xmlPost(url, data) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xhr.addEventListener("load", reqListener);
  console.log(xhr.responseText);
  xhr.send(JSON.stringify(data));
  console.log(JSON.stringify(data));
}

function reqListener () {
  console.log(this.responseText);
}