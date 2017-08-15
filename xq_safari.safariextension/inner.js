function toggleContent(elem, reason="")
{
  var reply = elem.nextElementSibling;

  // check if the reply is already hidden
  if (reply.offsetParent === null)
  {
    reply.style.display = "";
    toggleName(elem);
  }
  else
  {
    reply.style.display = "none";
    if(reason.length>0)
    {
      var reasonSpan = document.createElement("span");
      reasonSpan.setAttribute("style","color:#f00");

      if (reason == "length")
        reasonSpan.textContent = "长度大于设定值";
      else if (reason == "keyword") 
        reasonSpan.textContent = "关键词";

      elem.parentNode.insertBefore(reasonSpan, elem);
    }
    toggleName(elem, true);
  }
}

function toggleImageContent(elem)
{
  var images = elem.parentNode.getElementsByTagName("img");
  if (images[0].offsetParent === null)
  {
    for (var i = 0; i < images.length; ++i)
      images[i].setAttribute("style", "");

    toggleImageName(elem);
  }
  else
  {
    for (var i = 0; i < images.length; ++i)
      images[i].setAttribute("style", "display:none");
      
    toggleImageName(elem, true);
  }
}

function toggleName(elem, defaultStat = false)
{
  if (elem.textContent == "[-取消显示]" || defaultStat)
    elem.textContent = "[+显示全部]";
  else
    elem.textContent = "[-取消显示]";
}

function toggleImageName (elem, defaultStat = false)
{
  if (elem.textContent == "[-隐藏全部图片]" || defaultStat)
    elem.textContent = "[+显示全部图片]";
  else
    elem.textContent = "[-隐藏全部图片]";
}

function createToggler(reply)
{
  var newSpan = document.createElement("span");
  newSpan.setAttribute("style","cursor:pointer;color:#00f;");
  newSpan.onclick = function(){
    toggleContent(this);
  };

  toggleName(newSpan);

  reply.parentNode.parentNode.insertBefore(newSpan, reply.parentNode);

  return newSpan;
}

function createImageToggler(reply)
{
  var newSpan = document.createElement("span");
  newSpan.setAttribute("style", "cursor:pointer;color:#00f;");
  newSpan.onclick = function(){
    toggleImageContent(this);
  };

  toggleImageName(newSpan);

  reply.insertBefore(newSpan, reply.firstChild);

  toggleImageContent(newSpan); 

  return newSpan;
}

function checkKeyword(txt, keylistall, keylistany)
{
  // keywords &&
  if (keylistall.length>0)
  {
    var containAll = true;
    for(var i = 0; i < keylistall.length; ++i)
    {
      if (txt.indexOf(keylistall[i]) == -1)
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
      if (txt.indexOf(keylistany[i]) != -1)
        return true;
    }
  }

  return false;
}

function hasKeyword(trow, keylistall, keylistany)
{
  var threadtitle = trow.getElementsByTagName("a")[0].textContent;

  return checkKeyword(threadtitle, keylistall, keylistany);
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

    toggleThreadName(toggler, filtercount);
  }
  else
  {
    for (var i = 0; i < threads.length; ++i)
      threads[i].setAttribute("style", "display:none");

    toggleThreadName(toggler, filtercount);
  }
}

function hasImage(elem)
{
  return (elem.getElementsByTagName("img").length > 0);
}

function ignoreThis(elem, h)
{
  return (elem.scrollHeight <= h);
}

function toggleThreadName(toggler, hiddencount = 0)
{
  if (toggler.textContent.indexOf("[-隐藏") != -1)
    toggler.textContent = "[+显示"+hiddencount+"屏蔽帖]";
  else
    toggler.textContent = "[-隐藏"+hiddencount+"屏蔽帖]";
}

function inner(settings)
{
  var replies = document.getElementsByClassName('read');

  for (var i = 0; i < replies.length; ++i)
  {
    if (settings.hidepic == true && hasImage(replies[i]))
      createImageToggler(replies[i]);

    // check max height
    if (replies[i].scrollHeight > settings.hideHeight)
    {
      var newSpan = createToggler(replies[i]);
      toggleContent(newSpan, "length");
      continue;
    }

    // keyword search
    if (settings.hideKeyword==true && checkKeyword(replies[i].textContent, settings.keywordListAll, settings.keywordListAny))
    {
      var newSpan = createToggler(replies[i]);
      toggleContent(newSpan, "keyword");
      continue;
    }

    // don't process if height is less then ignoreheight
    if (ignoreThis(replies[i], settings.ignoreHeight))
      continue;

    createToggler(replies[i]);
  }

  // process complete
  safari.self.tab.dispatchMessage("complete");
}

function frontpage(settings)
{
  // find all thread that need to be hidden
  var allthreads = document.getElementsByTagName("tr");

  var filtercount = 0;

  for (var i = 0; i < allthreads.length; ++i)
  {
    if (allthreads[i].getAttribute("valign") != undefined && allthreads[i].getAttribute("valign") == "middle" &&
        hasKeyword(allthreads[i], settings.threadKeyListAll, settings.threadKeyListAny))
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

  toggleThreadName(newSpan, filtercount);

  document.getElementById("searchlink").parentNode.appendChild(newSpan);

  toggleThread(newSpan, filtercount); 

  // process complete
  safari.self.tab.dispatchMessage("complete");
}

safari.self.addEventListener("message", function(msgEvent){
  if (msgEvent.name === "thread")
    inner(msgEvent.message);
  else if (msgEvent.name === "frontpage")
    frontpage(msgEvent.message);
}, false);

// check automation setting
if (window.top === window)
{
  safari.self.tab.dispatchMessage("isAuto");
}