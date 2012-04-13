let awesomebar = require('awesomebar');
let apps       = require('apps');

awesomebar.add({
  keyword: 'apps',
  onSearch: function(query, suggest) {
    apps.search(query, function(app) {
      suggest({
        title: app.leafName,
        url: 'app:' + app.path
      });
    });
  }
});


// Protocol handler for loading about:response
var handler = require('protocol').protocol('app', {
  onRequest: function(request, response) {
    response.end();
    let path = decodeURI(request.uri).substr(6);
    apps.search(path, function(app) {
      if (app.path == path)
        apps.launch(path);
    });
  }
});
handler.register();
