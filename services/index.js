const db = require('../mongodb/setup');

const collection = 'urls';

const save = async ({ url, hash }) => {
  return (await db).collection(collection).insertOne({ url, hash });
};

const load = async ({ hash }) => {
  return (await db).collection(collection).findOne({ hash });
};

const remove = async ({ hash }) => {
  return (await db).collection(collection).deleteMany({ hash });
};

module.exports = {
  save,
  load,
  remove,
};

