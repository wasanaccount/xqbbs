chrome.storage.local.get({
  autostart: false,
  hidethread: false,
  threadkeylistall: [],
  threadkeylistany: []
}, function(items){
  if (items.autostart && items.hidethread)
    main(items);
});

chrome.runtime.onMessage.addListener(function(msg){
  if (msg == "frontpage")
  {
    chrome.storage.local.get({
      hidethread: false,
      threadkeylistall: [],
      threadkeylistany: []
    }, function(items){
      main(items);
    });
  }
});

function main(settings)
{
  // find all thread that need to be hidden
  var allthreads = document.getElementsByTagName("tr");

  var filtercount = 0;

  for (var i = 0; i < allthreads.length; ++i)
  {
    if (allthreads[i].getAttribute("valign") != undefined && allthreads[i].getAttribute("valign") == "middle" &&
        hasKeyword(allthreads[i], settings.threadkeylistall, settings.threadkeylistany))
    {
      allthreads[i].setAttribute("class", "xqbbs-thfilter");
      ++filtercount;
    }
  }

  // create toggler for toggling threads
  var newSpan = document.createElement("span");
  newSpan.setAttribute("style", "cursor:pointer;color:#00f;");
  newSpan.setAttribute("id", "xqbbs-thread-toggler");
  newSpan.onclick = function(){ toggleThread(this, filtercount); };

  toggleName(newSpan, filtercount);

  document.getElementById("searchlink").parentNode.appendChild(newSpan);

  toggleThread(newSpan, filtercount); 

  // process completed
  afterProcess();
}

function toggleThread(toggler, filtercount = 0)
{
  var threads = document.getElementsByClassName("xqbbs-thfilter");

  if (threads.length <= 0)
    return;

  if (threads[0].offsetParent === null)
  {
    for (var i = 0; i < threads.length; ++i)
      threads[i].setAttribute("style", "");

    toggleName(toggler, filtercount);
  }
  else
  {
    for (var i = 0; i < threads.length; ++i)
      threads[i].setAttribute("style", "display:none");

    toggleName(toggler, filtercount);
  }
}

function hasKeyword(trow, keylistall, keylistany)
{
  var threadtitle = trow.getElementsByTagName("a")[0].textContent;

  // keywords &&
  if (keylistall.length>0)
  {
    var containAll = true;
    for(var i = 0; i < keylistall.length; ++i)
    {
      if (threadtitle.indexOf(keylistall[i]) == -1)
      {
        containAll = false;
        break;
      }
    }
    
    if(containAll)
      return true;
  }

  // keywords ||
  if(keylistany.length>0)
  {
    for(var i = 0; i < keylistany.length; ++i)
    {
      if (threadtitle.indexOf(keylistany[i]) != -1)
        return true;
    }
  }
  
  return false;
}

function toggleName(toggler, hiddencount = 0)
{
  if (toggler.textContent.indexOf("[-隐藏") != -1)
    toggler.textContent = "[+显示"+hiddencount+"屏蔽帖]";
  else
    toggler.textContent = "[-隐藏"+hiddencount+"屏蔽帖]";
}

function afterProcess()
{
  var indicator = document.createElement("div");
  indicator.setAttribute("style", "background-color:#097;color:white;padding:10px;top:0px;position:sticky;z-index:100;");
  indicator.setAttribute("align", "center");
  indicator.textContent = "(๑•̀ㅂ•́)و✧防刷完成";
  var bodyElem = document.getElementsByTagName("body")[0];
  bodyElem.insertBefore(indicator, bodyElem.firstChild);

  setTimeout(function(){
    indicator.remove();
  }, 2000);
}