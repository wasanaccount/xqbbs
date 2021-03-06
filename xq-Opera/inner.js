chrome.storage.sync.get({
  autostart: false,
  ignoreheight: 100,
  hideheight: 1000,
  hidekeyword: false,
  hidepic: false,
  keywordlistall: [],
  keywordlistany: []
},function(items){
  if (items.autostart)
    main(items);
});

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
      reasonSpan.setAttribute("style", "color:#f00");

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

function ignoreThis(elem, h)
{
  if (elem.scrollHeight <= h)
    return true;
  return false;
}

function createToggler(reply)
{
  var newSpan = document.createElement("span");
  newSpan.setAttribute("style", "cursor:pointer;color:#00f;");
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

function hasImage(elem)
{
  return (elem.getElementsByTagName("img").length > 0);
}

function ignoreThis(elem, h)
{
  return (elem.scrollHeight <= h);
}

function main(settings)
{
  var replies = document.getElementsByClassName('read');

  for (var i = 0; i < replies.length; ++i)
  {
    if (settings.hidepic == true && hasImage(replies[i]))
      createImageToggler(replies[i]); 

    // check max height
    if (replies[i].scrollHeight > settings.hideheight)
    {
      var newSpan = createToggler(replies[i]);
      toggleContent(newSpan, "length");
      continue;
    }

    // keyword search
    if (settings.hidekeyword==true && checkKeyword(replies[i].textContent, settings.keywordlistall, settings.keywordlistany))
    {
      var newSpan = createToggler(replies[i]);
      toggleContent(newSpan, "keyword");
      continue;
    }

    // don't process if height is less then ignoreheight
    if (ignoreThis(replies[i], settings.ignoreheight))
      continue;

    createToggler(replies[i]);
  }

  // process completed
  chrome.runtime.sendMessage("complete");
}

chrome.runtime.onMessage.addListener(function(msg){
  if (msg == "thread")
  {
    chrome.storage.sync.get({
      ignoreheight: 100,
      hideheight: 1000,
      hidekeyword: false,
      hidepic: false,
      keywordlistall: [],
      keywordlistany: []
    }, function(items){
      main(items);
    });
  }
});