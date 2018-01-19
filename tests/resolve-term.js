/*
 * resolve-term.js
 */


const util = require('util')
const chalk = require('chalk')

const resolveTerm = require('../resolve-term')

const nihLink = 'http://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&code=C115935&ns=NCI_Thesaurus'
const ontobeeLink = 'http://www.ontobee.org/ontology/OBI?iri=http://purl.obolibrary.org/obo/OBI_0002543'
const ebiLink = 'https://www.ebi.ac.uk/ols/ontologies/efo/terms?iri=http%3A%2F%2Fwww.ebi.ac.uk%2Fefo%2FEFO_1000978'


const link = ebiLink

console.log('')
console.log(chalk.bold('Loading: ') + link)
resolveTerm(link)
.then(value => {
  console.log(chalk.bold('Value: ') + inspect(value))
  console.log('')
})



function inspect(value) {
  return util.inspect(value, { colors: true, depth: 3 })
}
