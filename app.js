const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')

// var dev = false

// // LiveReload START
// if (dev) {
//   var publicDirectory = __dirname + '/public'
//   const connectLiveReload = require('connect-livereload')
//   var livereload = require('livereload')
//   var liveReloadServer = livereload.createServer()
//   liveReloadServer.watch(publicDirectory)
//   liveReloadServer.server.once('connection', () => {
//     setTimeout(() => {
//       liveReloadServer.refresh('/')
//     }, 8)
//   })
//   app.use(connectLiveReload())
// }
// // LiveReload END

const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(express.urlencoded({ extended: true }))

const mustache = require('mustache-express')
app.engine('mustache', mustache())
app.set('view engine', 'mustache')

app.set('views', __dirname + '/public/views')
app.use(express.static(__dirname + '/public'))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.setHeader('Content-Type', 'text/html')
  next()
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const routes = require('./routes/route.js')
app.use('/', routes)

const PORT = process.env.PORT || 8080
app.listen(PORT, function () {
  // console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.')
})
