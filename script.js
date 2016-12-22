var timer = setInterval(save, 100); // Update every 100ms
var storedNotes;

/* First time: Gets stored notes and displays it */
chrome.storage.local.get(['notes'], function(data) {
  $('#notesArea').val(data.notes);
})

/* Put cursor on text */
$('body').click();
$('#notesArea').focus();

/* Every 100ms */
function save() {
  chrome.storage.local.get(['notes'], function(data) {
    storedNotes = data.notes;
  })

  /* If text value changed, update */
  if($('#notesArea').val() != storedNotes) {
    chrome.storage.local.set({'notes': $('#notesArea').val()});
  }
}
