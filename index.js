/*
 * index.js
 */

const http = require('http')
const url = require('url')

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

function readAsJSON(stream) {
  return readAsString(stream).then(JSON.parse)
}

function readAsString(stream) {
  return new Promise((resolve, reject) => {
    let result = ''
    stream.on('data', chunk => result += chunk)
    stream.on('end', () => resolve(result))
    stream.on('error', reject)
  })
}
