var express = require('express')
var app = express()
var lessMiddleware = require('less-middleware')
var browserify_express = require('browserify-express');

// var bundle = browserify_express({
// 	entry: __dirname + '/app/index.js',
// 	watch: __dirname + '/app/index.js',
// 	mount: '/index.js',
// 	verbose: true,
// 	minify: false,
// 	write_file: __dirname + '/app/app_bundled.js',
// });

app.set('port', process.env.PORT || 8080)

app.use(lessMiddleware(__dirname, {
  force: true
}))

app.use(express.static(__dirname + '/app'))
// app.use(bundle)

app.listen(app.get('port'), function(){
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env)
})
