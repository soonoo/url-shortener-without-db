const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
module.exports = (async () => {
  const client = await MongoClient.connect(url);
  return client.db('bitly');
})();

