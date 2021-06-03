function handleMessage(request, sender, sendResponse) {
  try {
    debug_log("Got message in chrome sidebar script");
    show_response_in_sidebar(request);
  } catch (e) {
    debug_log(e);
    debug_file();
  }
}

chrome.runtime.onMessage.addListener(handleMessage);
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

