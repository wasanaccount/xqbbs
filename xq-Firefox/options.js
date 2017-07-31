function save_options(){
  var autostart = document.getElementById("autostart").checked;
  var ignoreHeight = document.getElementById("ignoreheight").value;
  var hideHeight = document.getElementById("hideheight").value;
  var hideKeyword = document.getElementById("hidekeyword").checked;
  var hidePic = document.getElementById("hidepic").checked;
  var keywordListAll = document.getElementById("keywordlistall").value;
  var keywordListAny = document.getElementById("keywordlistany").value;
  
  if (keywordListAll != undefined && keywordListAll.length > 0)
    keywordListAll = keywordListAll.split(";;");
  else 
    keywordListAll = [];

  if (keywordListAny != undefined && keywordListAny.length > 0)
    keywordListAny = keywordListAny.split(";;");
  else
    keywordListAny = [];
  
  chrome.storage.local.set({
    autostart: autostart,
    ignoreheight: ignoreHeight,
    hideheight: hideHeight,
    hidekeyword: hideKeyword,
    hidepic: hidePic,
    keywordlistall: keywordListAll,
    keywordlistany: keywordListAny
  }, function(){
    // update status
    var status = document.getElementById("status");
    status.textContent = "设置已保存";
    setTimeout(function(){
      status.textContent = "";
    }, 750);
  });
}

function restore_options(){
    // Use default settings
    chrome.storage.local.get({
      autostart: false,
      ignoreheight: 100,
      hideheight: 1000,
      hidekeyword: false,
      hidepic: false,
      keywordlistall: [],
      keywordlistany: []
    }, function(items){
      document.getElementById("autostart").checked = items.autostart;
      document.getElementById("ignoreheight").value = items.ignoreheight;
      document.getElementById("hideheight").value = items.hideheight;
      document.getElementById("hidekeyword").checked = items.hidekeyword;
      document.getElementById("hidepic").checked = items.hidepic;
      document.getElementById("keywordlistall").value = items.keywordlistall.join(";;");
      document.getElementById("keywordlistany").value = items.keywordlistany.join(";;");
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById("save").addEventListener('click', save_options);