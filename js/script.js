/* Initialize new text editor */
var editor = new Editor();
editor.render();

var timer = setInterval(save, 100); // Update every 100ms
var storedNotes;

/* Get time and print title message accordingly */
var d = new Date(),
    h = d.getHours(),
    name;

updateMessage();

/* First time: Gets stored notes and displays it */
chrome.storage.sync.get(['notes'], function(data) {
  if(data.notes != "") {
    editor.codemirror.setValue(data.notes);
  } else {
    editor.codemirror.setValue("These are your notes.");
  }
  editor.togglePreview();
})

/* Every 100ms */
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

$("#settingsButton").click(function() {
  if(settingsRendered) {
    $("#settingsText").text("");
    settingsRendered = false;
  } else {
    $.ajax({url: "templates/settings.html", success: function(result){
        $("#settingsText").html(result);
        $("#nameInput").val(name);
        settingsRendered = true;
    }});
  }
});

$( document ).ajaxComplete(function() {
  $("#saveSettings").click(function() {
    chrome.storage.local.set({'userName': $("#nameInput").val()});
    location.reload();
    updateMessage();
    $("#settingsText").text("");
  });
});

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
    } else if (h < 10) { // evening
      $('#title').text("Good evening " + name);
    } else { // night
      $('#title').text("Good night " + name);
    }
  });
}
