chrome.browserAction.onClicked.addListener(function(tab) {
    if (checkUrl(tab.url))
        chrome.tabs.sendMessage(tab.id, "start");
});

function checkUrl(url){
    return (url!=undefined && (url.indexOf("bbs.jjwxc.net/showmsg.php") != -1 || url.indexOf("bbs.jjwxc.com/showmsg.php") != -1));
}