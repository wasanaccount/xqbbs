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

      switch (reason)
      {
        case "length": reasonSpan.textContent = "长度大于设定值"; break;
        case "keyword": reasonSpan.textContent = "关键词"; break;
        case "pic": reasonSpan.textContent = "含图片"; break;
      }

      elem.parentElement.insertBefore(reasonSpan, elem);
    }
    toggleName(elem, true);
  }
}

function toggleName(elem, defaultStat = false)
{
  if (elem.textContent == "[-取消显示]" || defaultStat)
    elem.textContent = "[+显示全部]";
  else
    elem.textContent = "[-取消显示]";
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

function hasImage(elem)
{
  if (elem.getElementsByTagName("img").length > 0)
    return true;
  else
    return false;
}

function ignoreThis(elem, h)
{
  if (elem.scrollHeight <= h)
    return true;
  return false;
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

function main(settings)
{
  var replies = document.getElementsByClassName('read');

  for (var i = 0; i < replies.length; ++i)
  {
    // check max height
    if (replies[i].scrollHeight > settings.hideHeight)
    {
      var newSpan = createToggler(replies[i]);
      toggleContent(newSpan, "length");
      continue;
    }
    
    if (settings.hidePic == true && hasImage(replies[i]))
    {
      var newSpan = createToggler(replies[i]);
      toggleContent(newSpan, "pic");
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

safari.self.addEventListener("message", function(msgEvent){
  if (msgEvent.name === "activate")
    main(msgEvent.message);
}, false);

// check automation setting
if (window.top === window)
{
  safari.self.tab.dispatchMessage("isAuto");
}