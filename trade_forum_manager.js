/**
 * Created by bouza on 27/08/14.
 */
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.action == "getDOM")
        sendResponse({dom: "The dom that you want to get"});
    else
        sendResponse({}); // Send nothing..
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    /* If the received message has the expected format... */
    if (msg.text && (msg.text == "report_back")) {
        /* Call the specified callback, passing
         the web-pages DOM content as argument */
        sendResponse(document.all[0].outerHTML);
    }
});