require('dotenv').config()
const http = require('http')
const app = require('./app')(__dirname)
const server = http.createServer(app)

require('./socket')(server)
const { Nuxt, Builder } = require('nuxt')

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')


async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host } = nuxt.options.server
  const port = 8080

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)
  // Socket
  // Listen the server
  server.listen(port, host)
  console.log(`Server is running on http://${host}:${port}`)
}
start()

// Only Server
// const nuxt = new Nuxt(config)
// const { host, port } = nuxt.options.server
// app.listen(port, host)
// console.log(`Server is running on http://${host}:${port}`)