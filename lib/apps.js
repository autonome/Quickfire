const { Cc, Ci, Cm, Cu, Cr, components } = require("chrome");

let apps = [];

function getAppsFromDirectory(aDir) {
  var dirs = [aDir];
  while (dirs.length) {
    var dir = dirs.shift();
    var entries = dir.directoryEntries;
    while (entries.hasMoreElements()) {
      var entry = entries.getNext();
      entry.QueryInterface(Ci.nsIFile);
      if (/\.app$/.test(entry.path))
        yield entry;
      else if (entry.isDirectory())
        dirs.push(entry)
    }
  }
}

function getAppList(callback) {
  let apps = [];
  ["LocApp", "UsrApp"].forEach(function(aDir) {
    var dirFile = Cc["@mozilla.org/file/directory_service;1"].
                  getService(Ci.nsIProperties).get(aDir, Ci.nsIFile);

    var appGetter = getAppsFromDirectory(dirFile);

    for (var app in appGetter) {
      if (/\.app$/.test(app.path))
        apps.push(app);
    }
  });
  callback(apps);
}


getAppList(function(theApps) {
  apps = theApps;
});

exports.search = function(searchString, callback) {
  apps.forEach(function(app) {
    if (app.path.toLowerCase().indexOf(searchString.toLowerCase()) != -1)
      callback({
        leafName: app.leafName,
        path:     app.path
      });
  });
};


function launchApp(aPath) {
  if (!apps.some(function(app) app.path == aPath))
    return;
  var binFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
  binFile.initWithPath(aPath);
  binFile.launch();
}

exports.launch = launchApp;
