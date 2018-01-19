/*
 * database.js
 */


const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const sqlite3 = require('sqlite3')

const db = new sqlite3.Database(process.env.DB || path.join(__dirname, 'cache.sqlite3'))

const toPromise = fn =>
  (...args) =>
    new Promise((resolve, reject) =>
      fn.apply(db, args.concat((err, res) => err ? reject(err) : resolve(res))))

db.get = promisify(db.get)
db.all = promisify(db.all)
db.run = promisify(db.run)


db.get(`SELECT name FROM main.sqlite_master WHERE type='table'`)
.then((row) => {
  if (!row)
    db.run(`CREATE TABLE links (
      url   text primary key,
      value text not null
    );`)
})

function get(url) {
  return db.get(`SELECT value FROM links WHERE url = ?`, [ url ])
    .then(row => row ? row.value : undefined)
}

function set(url, value) {
  return db.run(`
    INSERT OR REPLACE INTO links (url, value) VALUES ($url, $value)
  `, { $url: url, $value: value })
}

module.exports = { get, set }
