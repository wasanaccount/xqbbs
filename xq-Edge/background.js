chrome.browserAction.onClicked.addListener(function(tab) {
    if (checkUrl(tab.url))
        chrome.tabs.sendMessage(tab.id, "start");
});

function checkUrl(url){
    if (url!=undefined && (url.indexOf("bbs.jjwxc.net/showmsg.php") != -1 || url.indexOf("bbs.jjwxc.com/showmsg.php") != -1))
        return true;
    else 
        return false;
}