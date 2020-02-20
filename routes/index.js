const router = require('koa-router')()
const { writeFile, writeFileSync, readFileSync, existsSync, createReadStream } = require('fs');
const { createInterface } = require('readline');
const { createHash } = require('crypto');
const mkdirp = require('mkdirp');
const db = require('../services');

router.get('/all', async (ctx, next) => {
  const readable = createReadStream('./db/metadata/list');
  let ret = [];
  let hasUrl = false;
  let count = 0;
  const rl = createInterface({
    input: readable,
  });

  const rlPromise = new Promise((resolve, reject) => {
    rl.on('close', () => resolve());
  });
  rl.on('line', (line) => {
    if(count++ > 20) {
      rl.close();
      return;
    }
    const [url, hash] = line.split(' ');
    ret = ret.concat([{ url, hash }]);
  });
  await rlPromise;

  ctx.body = ret;
});

// redirect hash to original url
router.get('/:hash', async (ctx, next) => {
  const { hash } = ctx.params;

  const { url } = await db.load({ hash })
  ctx.redirect(url);
});

// transform url to hash
router.post('/', async (ctx, next) => {
  const { body } = ctx.request;
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  if(!regex.test(body)) {
    ctx.status = 400;
    return;
  }

  const hash = createHash('md5').update(body).digest('hex').slice(0, 6);
  await db.save({ url: body, hash });

  ctx.body = `http://localhost:3000/${hash}`;
});

router.delete('/:hash', async (ctx, next) => {
  const { hash } = ctx.params;
  const result = await db.remove({ hash });
  ctx.status = 200;
});

module.exports = router

