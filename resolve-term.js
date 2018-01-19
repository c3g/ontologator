/*
 * resolve-term.js
 */


const qs = require('querystring')
const URL = require('url')
const cheerio = require('cheerio')
const request = require('request-promise')

module.exports = resolveTerm

const extractors = {
  nih: ($) => {
    const selector = '#main-area_960 > div.pagecontentLittlePadding > div.tabTableContentContainer > p:nth-child(2)'
    const text = $(selector).text()
    const value = text.slice(text.indexOf(':') + 1).trim()
    return value
  },
  ontobee: ($, link) => {
    const hostname = getHostname(link)
    const url = new URL.URL(link)
    const purlLink = hostname === 'www.ontobee.org' ?
      url.searchParams.get('iri') :
      link

    const selector = `Class[rdf\\:about="${purlLink}"] > rdfs\\:label`
    const value = $(selector).text().trim()
    return value
  },
  ebi: ($, link) => {
    const selector = `[property=name]`
    const value = $(selector).text().trim()
    return value
  },
  sequence: ($, link) => {
    const selector = '#main_content table > thead > tr > th > h2'
    const text = $(selector).text()
    const value = text.slice(0, text.lastIndexOf('(')).trim()
    return value
  }
}

function resolveTerm(link) {
  const extractor = getExtractor(link)

  if (!extractor)
    return Promise.reject(new Error(`Couldn't find extractor for ${link}`))

  return request(link)
    .then(cheerio.load)
    .then($ => extractor($, link))
    .then(value => {
      return value
    })
}

function getExtractor(link) {
  switch (getHostname(link)) {
    case 'ncit.nci.nih.gov': return extractors.nih
    case 'www.ontobee.org':
    case 'purl.obolibrary.org': return extractors.ontobee
    case 'www.ebi.ac.uk': return extractors.ebi
    case 'www.sequenceontology.org': return extractors.sequence
  }
  return undefined
}

function getHostname(link) {
  return URL.parse(link).hostname
}
