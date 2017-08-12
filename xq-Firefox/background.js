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

function onExecuted(){
    chrome.notifications.create({type: "basic", title:"(๑•̀ㅂ•́)و✧",message: "防刷完成", iconUrl: "xq38.png"},
        function(notid){
            setTimeout(function(){chrome.notifications.clear(notid);}, 2000);
    });
}

chrome.runtime.onMessage.addListener(function(msg){
  if (msg == "complete")
    {
      onExecuted();
    }
});
