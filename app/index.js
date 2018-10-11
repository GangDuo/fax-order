var Nightmare = require('nightmare'),
    vo = require('vo'),
    exec = require('child_process').exec;

function crawler(urls) {
  var nightmare = Nightmare();

  var run = function * () {
    var titles = [];
    for (var i = 0; i < urls.length; i++) {
      var title = yield nightmare.goto(urls[i])
        .wait('body')
        .title();
      titles.push(title);
    }
    return titles;
  }

  vo(run)(function(err, titles) {
    console.dir(titles);
    titles.forEach((t) => exec('echo ' + t, (err, stdout, stderr) =>{}));
  });
}

(function() {
  crawler(['http://www.yahoo.com', 'http://example.com', 'http://w3c.org']);
  crawler(['https://www.google.com/', 'https://www.goo.ne.jp/', 'https://github.com/']);
})();
