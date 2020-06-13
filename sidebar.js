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
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      msg
    ).then(response => {
      console.log("Message from the content script:");
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
    }).catch(onError);
  }
}

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
