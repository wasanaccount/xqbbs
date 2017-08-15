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

function onExecuted(){
    chrome.notifications.create({type: "basic", title:"(๑•̀ㅂ•́)و✧",message: "防刷完成", iconUrl: "xq38.png"},
        function(notid){
            setTimeout(function(){chrome.notifications.clear(notid);}, 2000);
    });
}

chrome.runtime.onMessage.addListener(function(msg){
  if (msg == "complete")
      onExecuted();
});
