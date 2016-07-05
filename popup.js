
// Holds the current search's tab results
var matchingTabs;

/** Renders the search results and populates matchingTabs */
function renderSearch() {
  var t = document.getElementById("test").value;
  document.getElementById('status').innerHTML = t;
  chrome.tabs.query({"title": "*"+t+"*"}, function(tabs) {
    matchingTabs = {"id":[], "window":[], "index":[]};

    var outText = "<h3>Number of tabs: " + tabs.length + '</h3>';
    for (var i = 0; i < tabs.length; i++) {
       matchingTabs["id"].push(tabs[i].id);
       matchingTabs["window"].push(tabs[i].windowId);
       matchingTabs["index"].push(tabs[i].index);
       outText += '<p>'+tabs[i].title+'</p>';
    }
    document.getElementById('count').innerHTML = outText;
    document.getElementById('inputButton').style.display = "none";
    document.getElementById('resetButton').style.display = "block";
    document.getElementById('moveAllButton').style.display = "block";
    document.getElementById('submitDiv').innerHTML = '';
  })
}

/** Grab all Tabs functionality */
function moveTabs() {
  var lastMatchingId = matchingTabs["id"].pop()
  chrome.windows.create({tabId:lastMatchingId}, function (wind) {chrome.tabs.move(matchingTabs["id"], {windowId: wind.id, index:0})})
  matchingTabs["id"].push(lastMatchingId)
  document.getElementById('moveAllButton').style.display = "none";
  document.getElementById('moveBackAllButton').style.display = "block";
}

/** Return all Tabs functionality */
function moveBackTabs() {
  for (var i = 0; i < matchingTabs["id"].length; i++){
    chrome.tabs.move(matchingTabs["id"][i], {windowId:matchingTabs["window"][i], index:matchingTabs["index"][i]})
  }
  document.getElementById('moveAllButton').style.display = "block";
  document.getElementById('moveBackAllButton').style.display = "none";
}

/** Add onClick events for buttons after buttons have been rendered in the extension */
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('inputButton').addEventListener("click", renderSearch);
  document.getElementById('resetButton').addEventListener("click", function() {document.location="popup.html"})
  document.getElementById('moveAllButton').addEventListener("click", moveTabs);
  document.getElementById('moveBackAllButton').addEventListener("click", moveBackTabs);
});
