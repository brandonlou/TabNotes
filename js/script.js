/* Initialize new text editor */
var editor = new Editor();
editor.render();

var storedNotes;

/* First time: Gets stored notes and displays it */
chrome.storage.sync.get(['notes'], function(data) {
  if(data.notes != "") {
    editor.codemirror.setValue(data.notes);
  } else {
    editor.codemirror.setValue("These are your notes.");
  }
  editor.togglePreview();
})

/* Runs every 100ms */
function save() {
  chrome.storage.sync.get(['notes'], function(data) {
    storedNotes = data.notes;
  })

  /* If text value changed, update */
  if(editor.codemirror.getValue() != storedNotes) {
    chrome.storage.sync.set({'notes': editor.codemirror.getValue()});
  }
}

var settingsRendered = false;
var infoRendered = false;
/* Settings ajax */
$("#settingsButton").click(function() {
  if(settingsRendered) {
    $("#extraText").text("");
    settingsRendered = false;
    infoRendered = false;
  } else {
    $.ajax({url: "templates/settings.html", success: function(result){
        $("#extraText").html(result);
        $("#nameInput").val(name);
        settingsRendered = true;
        infoRendered = false;
    }});
  }
});

$("#infoButton").click(function() {
  if(infoRendered) {
    $("#extraText").text("");
    infoRendered = false;
  } else {
    $.ajax({url: "templates/info.html", success: function(result){
        $("#extraText").html(result);
        settingsRendered = false;
        infoRendered = true;
    }});
  }
});

/* When settings ajax is done loading, add event listener */
$( document ).ajaxComplete(function() {
  $("#saveSettings").click(function() {
    chrome.storage.local.set({'userName': $("#nameInput").val()});
    location.reload();
    updateMessage();
    $("#settingsText").text("");
  });
});

/* Get time and print title message accordingly */
var d = new Date(),
    h = d.getHours(),
    name;

function updateMessage() {
  chrome.storage.local.get(['userName'], function(data) {
    name = data.userName;
    if(name == "undefined") name = "World";
    if (h < 4) { // night
      $('#title').text("Good night " + name);
    } else if (h < 12) { // morning
      $('#title').text("Good morning " + name);
    } else if (h < 17) { // afternoon
      $('#title').text("Good aftenoon " + name);
    } else if (h < 22) { // evening
      $('#title').text("Good evening " + name);
    } else { // night
      $('#title').text("Good night " + name);
    }
  });
}

$('.CodeMirror').dblclick(function(e){
  e.stopPropagation(); // stops next event handler ish
  toggle("inside");
});
$(document).dblclick(function(){
  toggle("outside");
});

function toggle(clicked) {
  if(onPreview && clicked == "inside") {
    editor.togglePreview();
  } else if (!onPreview && clicked == "outside") {
    editor.togglePreview();
  }
}

// Start !
updateMessage();
var timer = setInterval(save, 100); // Update every 100ms
