// log string saved here
var debug_log_v = "";
function debug_log(a) {
  if (a instanceof Error) {
    debug_log_v += a.toString() + "\n";
  } else {
    debug_log_v += JSON.stringify(a) + "\n";
  }
}

function debug_file(text) {
  document.getElementById("debuglog-link").href = make_file(debug_log_v);
  document.getElementById("debuglog").style.display = 'block';
  markRed(document.getElementById("result"));
}

browser.storage.local.get("cache_params").then((d) => {
  debug_log(d.cache_params);
  var params = ["forecast", "temperature", "collision", "defense", "spectators", "gencsv"];
  for (var i = 0; i < params.length; i++) {
    if (d.cache_params[params[i]]) {
      document.getElementById(params[i]).value = d.cache_params[params[i]];
    }
  }
  debug_log("cached_params setted");
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
  debug_log(response);
  if (response) {
    if (response.csv) {
      var link = document.getElementById("downloadlink");
      link.download = response.team_id.toString() + ".csv";
      link.href = make_file (response.csv);
      link.style.display = 'block';
      debug_log("Show download link with csv");
    }

    var result = document.getElementById("result");
    result.disabled = false;
    markMarked(result);
    result.value = response.strength;
    debug_log("Show strength result");
    if (!Number.isInteger(response.strength)) {
      debug_log("Result strength is not a number");
      debug_file();
    }
  }
}

function onError(error) {
  console.error(`Error: ${error}`);
  console.error("Error:", error);
  debug_log("Received error:");
  debug_log(error.toString());
  debug_file();
}

function sendMessageToTabs(tabs) {
  var msg = {
        greeting: "Hi from background script",
        forecast: 0,
        temperature: 0,
        collision: document.getElementById("collision").checked,
        defense: document.getElementById("defense").checked,
        spectators: parseInt(document.getElementById("spectators").value),
        gencsv: document.getElementById("generate-csv").checked
      };
  debug_log(msg);
  browser.storage.local.set({"cache_params": msg});
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      msg
    );
  }
}

function markRed(el) {
  el.classList.remove("pcs-input");
  el.classList.add("calc-red-border");
}

function markClean(el) {
  el.classList.remove("calc-red-border");
  el.classList.remove("calc-marked-output");
  el.classList.add("pcs-input");
}

function markMarked(el) {
  el.classList.remove("pcs-input");
  el.classList.add("calc-marked-output");
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

function disable_result() {
  document.getElementById("result").disabled = true;
}

document.getElementById("spectators").addEventListener("input", disable_result);
document.getElementById("collision").addEventListener("input", disable_result);
document.getElementById("defense").addEventListener("input", disable_result);

document.getElementById("calc-button").addEventListener("click", () => {
  debug_log_v = "";
  try {
    debug_log("click handler called");
    markClean(document.getElementById("result"));
    document.getElementById("downloadlink").style.display = "none";
    document.getElementById("debuglog").style.display = 'none';
    document.getElementById("temperature-range-error").style.display = 'none';
    document.getElementById("result").value = "";

    var spectators = document.getElementById("spectators");
    if (!sanitize_spectators(spectators.value)) {
      debug_log("spectators sanitization failed");
      markRed(spectators);
      return;
    } else {
      debug_log("spectators sanitization passed");
      markClean(spectators)
    }

    browser.tabs.query({
      currentWindow: true,
      active: true
    }).then(sendMessageToTabs).catch(onError);
  } catch (e) {
    debug_log(e);
    debug_file();
  }
});
