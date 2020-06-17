browser.storage.local.get("cache_params").then((d) => {
  console.log("A");
  console.log(d.cache_params);
  var params = ["forecast", "temperature", "collision", "defense", "spectators", "gencsv"];
  for (var i = 0; i < params.length; i++) {
    if (d.cache_params[params[i]]) {
      document.getElementById(params[i]).value = d.cache_params[params[i]];
    }
  }
});

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {urlContains: 'virtualsoccer.ru/mng_order.php', schemes: ['https']},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

var textFile = null;
function make_file(text) {
  var data = new Blob([text], {type: 'text/plain'});
  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }
  textFile = window.URL.createObjectURL(data);
  return textFile;
}

function onError(error) {
  console.error(`Error: ${error}`);
}

function sendMessageToTabs(tabs) {
  var msg = {
        greeting: "Hi from background script",
        forecast: document.getElementById("forecast").value,
        temperature: parseInt(document.getElementById("temperature").value),
        collision: document.getElementById("collision").checked,
        defense: document.getElementById("defense").checked,
        spectators: parseInt(document.getElementById("spectators").value),
        gencsv: document.getElementById("generate-csv").checked
      };
  console.log(msg);
  browser.storage.local.set({"cache_params": msg});
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      msg
    ).then(response => {
      console.log("Message from the content script:");
      if (response) {
      console.log(response.response);
      console.log(response);

      if (response.csv) {
        var link = document.getElementById("downloadlink");
        link.download = response.team_id.toString() + ".csv";
        link.href = make_file (response.csv);
        link.style.display = 'block';
      }

      document.getElementById("result").value = response.strength;
      document.getElementById("result").classList.add("calc-marked-output");
      }
    }).catch(onError);
  }
}

function handleMessage(request, sender, sendResponse) {
  console.log("Message from the content script: " +
    request.greeting);
  var response = request;
  console.log(response.response);
  console.log(response);

  if (response.csv) {
    var link = document.getElementById("downloadlink");
    link.download = response.team_id.toString() + ".csv";
    link.href = make_file (response.csv);
    link.style.display = 'block';
  }

  document.getElementById("result").value = response.strength;
  document.getElementById("result").classList.add("calc-marked-output");
}

chrome.runtime.onMessage.addListener(handleMessage);

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function markedRedOrClean(el) {
  if (isEmpty(el.value)) {
    el.classList.add("calc-red-border");
  } else {
    el.classList.remove("calc-red-border");
  }
}

document.getElementById("calc-button").addEventListener("click", () => {
  document.getElementById("result").classList.remove("calc-marked-output");
  document.getElementById("downloadlink").style.display = "none";
  var forecast = document.getElementById("forecast");
  var temperature = document.getElementById("temperature");
  console.log(forecast.value);
  markedRedOrClean(forecast);
  markedRedOrClean(temperature);
  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then(sendMessageToTabs).catch(onError);
});
