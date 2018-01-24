
# Ontologator

Ontologator is an ontology term resolution service. It listens for requests and
returns terms for the following ontologies:

 - ncit.nci.nih.gov
 - www.ontobee.org
 - purl.obolibrary.org
 - www.ebi.ac.uk
 - www.sequenceontology.org

Requests must be in the following format:

`http://service-hostname/<url>`
E.g.
`http://service-hostname/http://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&code=C115935&ns=NCI_Thesaurus`

The response will be in the following format:

```javascript
{
  "ok": true,
  "data": "Healthy"
}
// or
{
  "ok": false,
  "message": "Error: ..."
}
```


### Installing

```sh
npm install
```


### Running

```sh
npm start
```

The following envvars can be used for configuration:

 - `PORT` on which the application runs (default: `3500`)
 - `DB`, path of the sqlite3 cache (default: `cache.sqlite3`)
