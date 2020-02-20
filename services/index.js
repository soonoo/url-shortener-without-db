require('../mongodb/setup');
const ShortenUrl = require('../mongodb/schema/ShortenUrl');

const collection = 'urls';

const save = async ({ url, hash }) => {
  const shortenUrl = new ShortenUrl({ url, hash });
  return shortenUrl.save();
};

const load = async ({ hash }) => {
  return ShortenUrl.findOne({ hash });
};

const loadBulk = async ({ skip, limit } = { skip: 0, limit: 50 }) => {
  console.log(skip,limit)
  return ShortenUrl.find({}, null, { sort: '-createdAt', skip, limit })
};

const remove = async ({ hash }) => {
  return ShortenUrl.deleteMany({ hash });
};

module.exports = {
  save,
  load,
  loadBulk,
  remove,
};

