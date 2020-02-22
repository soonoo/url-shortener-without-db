const shortid = require('shortid');
const { createHash } = require('crypto');
const db = require('../../services');
const mongoose = require('mongoose');

(async () => {
  for(let i = 0; i < 10000000; i++) {
    console.log(i)
    const str = `https://${i}a.com`;
    await db.save({ url: str, hash: String(i) + 'a' });
  }
  await mongoose.disconnect()
})();

