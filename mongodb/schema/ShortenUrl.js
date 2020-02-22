const mongoose = require('mongoose');

const shortenUrlSchema = mongoose.Schema({
  url: String,
  hash: String,
}, {
  timestamps: { createdAt: 'createdAt' }
});
shortenUrlSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ShortenUrl', shortenUrlSchema);

