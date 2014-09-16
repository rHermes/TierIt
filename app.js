var koa = require('koa');
var kroute = require('kroute');
var render = require('koa-ejs');
var serve = require('koa-static');
var rethinkdbdash = require('rethinkdbdash');
var path = require('path');

var app = koa();
render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'application/layout',
  viewExt: 'ejs',
  cache: false,
  debug: true,
  locals: {
    siteName: 'TierIt'
  },
  filters: {}
});

var router = kroute();

// Rethinkdbdash
var r = rethinkdbdash();

app.use(serve(__dirname + '/fixtures'));

app.use(router);

router.get('/', function *() {
  yield this.render('index', {
    pageTitle: 'Home'
  });
});

router.get('/characters',
  function *() {
    var brawl_chars = yield r.db('tierit').table('characters').filter(r.row('games').contains('brawl')).orderBy('name').run();
    yield this.render('characters/overview', {
      pageTitle: 'Character Overview',
      characters: brawl_chars
      });
    }
);

app.listen(3000);
