function save_options(){
  var autostart = document.getElementById("autostart").checked;
  var ignoreHeight = document.getElementById("ignoreheight").value;
  var hideHeight = document.getElementById("hideheight").value;
  var hideKeyword = document.getElementById("hidekeyword").checked;
  var hidePic = document.getElementById("hidepic").checked;
  var keywordListAll = processKeywords(document.getElementById("keywordlistall").value);
  var keywordListAny = processKeywords(document.getElementById("keywordlistany").value);
  var hideThread = document.getElementById("hidethread").checked;
  var threadKeyListAll = processKeywords(document.getElementById("threadkeylistall").value);
  var threadKeyListAny = processKeywords(document.getElementById("threadkeylistany").value);

  chrome.storage.sync.set({
    autostart: autostart,
    ignoreheight: ignoreHeight,
    hideheight: hideHeight,
    hidekeyword: hideKeyword,
    hidepic: hidePic,
    keywordlistall: keywordListAll,
    keywordlistany: keywordListAny,
    hidethread: hideThread,
    threadkeylistall: threadKeyListAll,
    threadkeylistany: threadKeyListAny
  }, function(){
    // update status
    var status = document.getElementById("status");
    status.textContent = "设置已保存";
    setTimeout(function(){
      status.textContent = "";
    }, 750);
  });
}

function processKeywords(klist)
{
  if (klist != undefined && klist.length > 0)
    return klist.split(";;").filter(function(elem){return /\S/.test(elem);});
  else 
    return [];
}

function restore_options(){
    // Use default settings
    chrome.storage.sync.get({
      autostart: false,
      ignoreheight: 100,
      hideheight: 1000,
      hidekeyword: false,
      hidepic: false,
      keywordlistall: [],
      keywordlistany: [],
      hidethread: false,
      threadkeylistall: [],
      threadkeylistany: []
    }, function(items){
      document.getElementById("autostart").checked = items.autostart;
      document.getElementById("ignoreheight").value = items.ignoreheight;
      document.getElementById("hideheight").value = items.hideheight;
      document.getElementById("hidekeyword").checked = items.hidekeyword;
      document.getElementById("hidepic").checked = items.hidepic;
      document.getElementById("keywordlistall").value = items.keywordlistall.join(";;");
      document.getElementById("keywordlistany").value = items.keywordlistany.join(";;");
      document.getElementById("hidethread").checked = items.hidethread;
      document.getElementById("threadkeylistall").value = items.threadkeylistall.join(";;");
      document.getElementById("threadkeylistany").value = items.threadkeylistany.join(";;");
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById("save").addEventListener('click', save_options);