// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var x;
for (x = 0; x < myNodelist.length; x++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[x].appendChild(span);
}

// Click on a close button to hide the current list item
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
    store();
  }
}


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
  store();
}


function store() {
  var list = document.querySelector('ul');
  window.localStorage.myitems = list.innerHTML;
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