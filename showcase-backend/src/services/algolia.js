const { algolia: algoliaConfig } = require('../config')
const algoliasearch = require('algoliasearch')
const client = algoliasearch(algoliaConfig.id, algoliaConfig.adminKey)
module.exports = { client }
