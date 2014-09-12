/**
 * Created by bouza on 20/08/14.
 */

var currentURL = null;
var currentOffer = 0;
var totalOffers = 0;
var marketInfo = null;
var gameInfo = null;
var inventoryInfo = null;

var marketinfoFilePath = "data/marketinfo.json";
var gameinfoFilePath = "data/gameinfo.json";
var inventoryinfoFilePath = "data/inventoryinfo.json";

var tradeForumTopicInput = "forum_topic_input";
var tradeForumTopicTextarea = "forumtopic_reply_textarea";
var defaultContent = ":balloon: Complete Set/Badge :balloon:\n\n[h1]These are my trading policies:[/h1]\nːSocialPolicyː (A) ːtradingcardː:ːtradingcardː only if (1) cards are from the same set, (2) I have your requested card more than once, and (3) I don't have your offered card yet\nːSocialPolicyː (B) ːtradingcardː:ːtradingcardː+ːpostcardfː only if (1) cards are from the same set, (2) I don't have your card yet\nːSocialPolicyː (C) ːtradingcardː:ːtradingcardːːtradingcardː... if (1) rules above don't apply and (2) I'm interested\nːSocialPolicyː (D) ːtradingcardː:ːtradingcardː only if (1) I gain something. E.g., I've 3xA, 1xB. You offer 1xB for 1xA. I'll end up with 2xA, 2XB, which is a gain.\n[h1][/h1]\n\nI trade for other cards too! Feel free to take a look!\nGive it a try - worst case, I decline your offer or send you a counter offer.\n\nHave fun and happy gaming! ː8bitheartː\n\nhttp://steamcommunity.com/tradeoffer/new/?partner=65047285&token=Kgadebse";

var setTopicTitle = function(aTitle, aDocument) {
    var fieldTitle = aDocument.getElementsByClassName(tradeForumTopicInput)[0];
    if (fieldTitle == null) {
        return;
    }
    fieldTitle.value = aTitle;
}

var setTopicInfo = function(anInfo, aDocument) {
    var fieldContent = document.getElementsByClassName(tradeForumTopicTextarea)[0];
    if (fieldContent == null) {
        return;
    }
    fieldContent.value = anInfo;
}

var loadData = function(aFilePath) {
    var result;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        result = JSON.parse(xhr.responseText);
    }
    xhr.open("GET", chrome.extension.getURL(aFilePath), false);
    xhr.send();
    return result;
}

var retrieveCurrentURL = function() {
    var result = null;
    var amount = document.getElementsByClassName("whiteLink").length;
    for (var i = 0; i < amount; i++) {
        result = document.getElementsByClassName("whiteLink")[i].href;
        if (result.indexOf("trading") > 0) {
            return result;
        }
    }

    if (result == null) {
        result = retrieveCurrentURLFromBreadcrumbs();
    }
    return result;
}

var retrieveCurrentURLFromBreadcrumbs = function() {
    console.log(document.getElementsByClassName("forum_breadcrumbs")[0].getElementsByTagName("a")[1].href);

    return document.getElementsByClassName("forum_breadcrumbs")[0].getElementsByTagName("a")[1].href;
}

var createTradeforumURL = function(anId) {
    return "http://steamcommunity.com/app/" + anId + "/tradingforum/";
}

var update = function() {
    marketInfo = loadData(marketinfoFilePath);
    gameInfo = loadData(gameinfoFilePath);
    inventoryInfo = loadData(inventoryinfoFilePath);
    currentURL = retrieveCurrentURL();
    totalOffers = gameInfo.games.length;

    for (var i = 0; i < totalOffers; i++) {
        if (currentURL == createTradeforumURL(gameInfo.games[i].id)) {
            currentOffer = i;
            return;
        }
    }
}

var submitOffer = function() {
    var forms = document.getElementsByTagName("form")
    for (var i = 0; i < forms.length; i++) {
        if (forms[i].id.indexOf("Trading") > 0) {
            forms[i].getElementsByTagName("button")[0].click();
        }
    }
}

var loadNextTradingForum = function(nextOffer) {
    if (nextOffer <= totalOffers) {
        var set = getCardsInInventory(gameInfo.games[nextOffer].game);
        if (set != undefined && set.cards.length != 0) {
            this.document.location.href = createTradeforumURL(gameInfo.games[nextOffer].id);
        } else {
            loadNextTradingForum(nextOffer+1);
        }

    }
}

var submitOfferAndLoadNext = function(nextOffer) {
    var timeout1 = Math.floor((Math.random() * 10000) + 10000);
    setTimeout(function(){submitOffer()},timeout1);
    var timeout2 = Math.floor((Math.random() * 20000) + 30000);
    window.setTimeout(function(){loadNextTradingForum(nextOffer)},timeout2);
}

var getCardsInInventory = function(aGameTitle) {
    for (var i = 0; i < inventoryInfo.sets.length; i++) {
        if (inventoryInfo.sets[i].game == aGameTitle) {
            return inventoryInfo.sets[i];
        }
    }
}

var concatArray = function(anArray) {
    var result = "";
    for (var i = 0; i < anArray.length; i++) {
        if (i != 0) {
            result += " ";
        }
        result += anArray[i];
    }
    return result;
}

var retrieveTopicTitle = function(currentOffer) {
    var set = getCardsInInventory(gameInfo.games[currentOffer].game);
    var numOfCards = set.cards.length;
    var setSize = gameInfo.games[currentOffer].setSize;
    var result = "[H] " + numOfCards + "/" + setSize + " " + concatArray(set.cards) + " " + marketInfo.tradeforum.pmsg_wanted;
    return result;
}

var retrieveTopicContent = function(currentOffer) {
    var result = "";
    var set = getCardsInInventory(gameInfo.games[currentOffer].game);
    var numOfCards = set.cards.length;
    var setSize = gameInfo.games[currentOffer].setSize;
    if (numOfCards == setSize) {
        result += marketInfo.tradeforum.msg_completeset + "\n\n";
    }
    result += marketInfo.tradeforum.msg_content;
    result += "\n\n" + marketInfo.tradeforum.msg_tradelink;

    return result;

}

update();

var topicTitle = retrieveTopicTitle(currentOffer);
setTopicTitle(topicTitle, document);
var topicContent = retrieveTopicContent(currentOffer);
setTopicInfo(topicContent, document);
submitOfferAndLoadNext(currentOffer+1);





