/*
 * index.js
 */

const http = require('http')

const db = require('./database')
const resolveTerm = require('./resolve-term')

const port = process.env.PORT || 3500


const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err)
    return console.log(err)

  console.log(`server is listening on ${port}`)
})

function requestHandler(request, response) {
  console.log(request.url)

  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Request-Method', '*')
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  response.setHeader('Access-Control-Allow-Headers', 'authorization, content-type')

  if (request.method === 'OPTIONS') {
    response.writeHead(200)
    response.end()
    return
  }

  response.setHeader('content-type', 'application/json')

  const url = request.url.slice(1)

  // We might serve the value from cache, but we'll always update our value
  // as well, so we start the request before waiting on the DB answer.
  const resolution = resolveTerm(url)
    .then(value => {
      db.set(url, value)
      return value
    })

  // Check in the cache if we have the value
  db.get(url)
  .then(value => {
    if (value === undefined)
      return resolution

    return value
  })
  .then(value =>
    response.end(JSON.stringify({ ok: true, data: value }))
  )
  .catch(err => {
    response.end(JSON.stringify({ ok: false, message: err.toString() }))
  })
}
