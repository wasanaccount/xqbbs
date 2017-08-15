chrome.browserAction.onClicked.addListener(function(tab) {
    if (isThreadUrl(tab.url))
        chrome.tabs.sendMessage(tab.id, "thread");
    else if (isFrontpageUrl(tab.url))
        chrome.tabs.sendMessage(tab.id, "frontpage");
});

function isThreadUrl(url){
    return (url!=undefined && (url.indexOf("bbs.jjwxc.net/showmsg.php") != -1 || url.indexOf("bbs.jjwxc.com/showmsg.php") != -1));
}

function isFrontpageUrl(url){
    return (url!=undefined && (url.indexOf("bbs.jjwxc.net/board.php") != -1 || url.indexOf("bbs.jjwxc.com/board.php") != -1));
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if (isThreadUrl(changeInfo.url) || isFrontpageUrl(changeInfo.url))
        chrome.pageAction.show(tabId);
});