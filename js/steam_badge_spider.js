/**
 * Created by bouza on 27/08/14.
 */
/* Inform the backgrund page that
 * this tab should have a page-action */


var badges = {"games":[]};

var badgeGameLink = "badge_row_overlay";
var badgeGameTitle = "badge_title";

var retrieveGameId = function(aText) {
    var elements = aText.split("/");
    return parseInt(elements[elements.length-2]);
}
var retrieveGameTitle = function(aText) {
    result = aText.replace("&nbsp;\"","");

    return result.trim();
}

var addGame = function(anId, aTitle) {
    var newGame = {id: anId, game:aTitle, setSize:0};
    badges.games.push(newGame);
}


var parseInventory = function() {
    var badgeLinks = document.getElementsByClassName(badgeGameLink);
    var badgeTitles = document.getElementsByClassName(badgeGameTitle);
    console.log(badgeLinks.length + ":" + badgeTitles.length);
    for (var i = 0; i < badgeLinks.length; i++) {
        var id = retrieveGameId(badgeLinks[i].href);
        var title = retrieveGameTitle(badgeTitles[i].innerText);
        addGame(id, title);
    }

    console.log(JSON.stringify(badges, null, "  "));
}

/**
 * UI
 */

var insertDownloadButton = function() {
    var navBar = document.getElementsByClassName("badge_details_set_favorite")[0];
    var btnDownload = document.createElement("button");
    var txtDownload = document.createTextNode("download");
    btnDownload.appendChild(txtDownload);
    btnDownload.setAttribute("id", "stBadgeDownloader");
    btnDownload.addEventListener("click", parseInventory);
    navBar.appendChild(btnDownload);
}

insertDownloadButton();