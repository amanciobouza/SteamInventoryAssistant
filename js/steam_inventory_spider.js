/**
 * Created by bouza on 27/08/14.
 */
/* Inform the backgrund page that
 * this tab should have a page-action */


var inventory = [];
var inventoryCardsId = "context6";
var inventoryCardInfoTitleId = "iteminfo1_item_name";
var inventoryCardGameId = "iteminfo1_item_type";

var containsTradingCardInfo = function(aText) {
    if (aText.toLowerCase().indexOf("(trading card)")) {
        return true;
    }
    if (aText.toLowerCase().indexOf("trading card")) {
        return true;
    }
    return false;
}
var removeTradingCardInfo = function(aText) {
    var cleanedText = aText;
    if (aText.toLowerCase().indexOf("(trading card)") > 0) {
        var start = aText.toLowerCase().indexOf("(trading card)");
        cleanedText = aText.substr(0,start);
    } else if (aText.toLowerCase().indexOf("trading card") > 0) {
        var start = aText.toLowerCase().indexOf("trading card");
        cleanedText = aText.substr(0,start);
    }

    return cleanedText.trim();
}

var cleanTitle = function(aTitle) {
    var cleanedTitle = aTitle;
    if (containsTradingCardInfo(aTitle)) {
        cleanedTitle = removeTradingCardInfo(aTitle);
    }
    return cleanedTitle;
}

var cleanSpaces = function(aText) {
    var result = "";
    var splitted = aText.split(' ');
    for (var i = 0; i < splitted.length; i++) {
        var firstChar = splitted[i].substr(0,1).trim();
        firstChar = firstChar.toUpperCase();
        var rest = splitted[i].substr(1).trim();
        result += firstChar + rest;
    }
    return result;
}

var retrieveCardTitle = function() {
    var result = document.getElementById(inventoryCardInfoTitleId).innerText;
    result = cleanTitle(result);
    result = cleanSpaces(result);
    return result;
}
var retrieveCardGame = function() {
    var result = document.getElementById(inventoryCardGameId).innerText;
    result = cleanTitle(result);
    return result;
}

var getIndexOfGameInInventory = function(aGame) {
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].game == aGame) {
            return i;
        }
    }
    return -1;
}

var getIndexOfCardInInventory = function(someCards, aCardTitle) {
    for (var i = 0; i < someCards.length; i++) {
        if (someCards[i] == aCardTitle) {
            return i;
        }
    }
    return -1;
}

var addGameToInventory = function(aGameTitle) {
    if (getIndexOfGameInInventory(aGameTitle) < 0) {
        var newGame = {game:aGameTitle, cards:[]};
        inventory.push(newGame);
    }
}

var addCardToInventory = function(aGameTitle, aCardTitle) {
    var gameIndex = getIndexOfGameInInventory(aGameTitle);
    if (getIndexOfCardInInventory(inventory[gameIndex].cards, aCardTitle) < 0) {
        inventory[gameIndex].cards.push(aCardTitle);
    }
}

var retrieveWebCard = function(aTradingItem, i) {
    var time = i*600;
    window.setTimeout(function(){
        aTradingItem.getElementsByClassName("inventory_item_link")[0].click();
        aTradingItem.getElementsByClassName("inventory_item_link")[0].click();
        retrieveCard();
    }, time)}

var retrieveCard = function() {
    var cardTitle = retrieveCardTitle();
    var cardGame = retrieveCardGame();
    addGameToInventory(cardGame);
    addCardToInventory(cardGame, cardTitle);
}

var parseInventory = function() {
    var tradingItems = document.getElementsByClassName(inventoryCardsId); //item
    for (var i = 1; i < 375; i++) {//tradingItems.length; i++) {
        retrieveWebCard(tradingItems[i], i);
    }
    window.setTimeout(function(){
        var inventoryinfo = {sets: inventory};
        console.log(JSON.stringify(inventoryinfo, null, "  "));
    }, 400*600+300);

}

/**
 * UI
 */

var insertDownloadButton = function() {
    var navBar = document.getElementsByClassName("inventory_rightnav")[0];
    var btnDownload = document.createElement("button");
    var txtDownload = document.createTextNode("download");
    btnDownload.appendChild(txtDownload);
    btnDownload.setAttribute("id", "stInventoryDownloader");
    btnDownload.addEventListener("click", parseInventory);
    navBar.appendChild(btnDownload);
}

insertDownloadButton();