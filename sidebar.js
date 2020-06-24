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

function show_response_in_sidebar (response) {
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
    document.getElementById("result").classList.remove("pcs-input");
    document.getElementById("result").classList.add("calc-marked-output");
  }
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
      show_response_in_sidebar(response);
    }).catch(onError);
  }
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function markRed(el) {
  el.classList.remove("pcs-input");
  el.classList.add("calc-red-border");
}

function markClean(el) {
  el.classList.remove("calc-red-border");
  el.classList.add("pcs-input");
}

function sanitize_temperature(v) {
  var t = parseInt(v);
  if (isNaN(t)) {
    return false;
  }
  if (t < 0 || t > 30) {
    return false;
  }
  return true;
}

function sanitize_spectators(v) {
  var t = parseInt(v);
  if (isNaN(t)) {
    return false;
  }
  if (t < -1 || t > 100) {
    return false;
  }
  return true;
}

document.getElementById("calc-button").addEventListener("click", () => {
  document.getElementById("result").classList.remove("calc-marked-output");
  document.getElementById("result").classList.add("pcs-input");
  document.getElementById("downloadlink").style.display = "none";
  var forecast = document.getElementById("forecast");
  var temperature = document.getElementById("temperature");
  var spectators = document.getElementById("spectators");
  if (!sanitize_temperature(temperature.value)) {
    markRed(temperature);
    return;
  } else {
    markClean(temperature)
  }
  if (!sanitize_spectators(spectators.value)) {
    markRed(spectators);
    return;
  } else {
    markClean(spectators)
  }
  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then(sendMessageToTabs).catch(onError);
});
