const mongoose = require('mongoose');

const shortenUrlSchema = mongoose.Schema({
  url: String,
  hash: String,
}, {
  timestamps: { createdAt: 'createdAt' }
});

module.exports = mongoose.model('ShortenUrl', shortenUrlSchema);

