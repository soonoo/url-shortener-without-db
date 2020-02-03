const router = require('koa-router')()
const { writeFile, writeFileSync, readFileSync, existsSync, createReadStream } = require('fs');
const { createInterface } = require('readline');
const { createHash } = require('crypto');
const mkdirp = require('mkdirp');

router.get('/:checksum', async (ctx, next) => {
  const { checksum } = ctx.params;
  const fileName = `./db/${checksum[0]}/${checksum[1]}/${checksum.slice(2)}`;

  if(existsSync(fileName)) {
    const url = readFileSync(fileName, { encoding: 'utf-8' });
    ctx.redirect(url);
    ctx.status = 301;
  } else {
    ctx.status = 404;
  }
});

router.post('/', async (ctx, next) => {
  const { body } = ctx.request;
  let i = 0;
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  if(!regex.test(body)) {
    ctx.status = 400;
  }

  const h = createHash('md5').update(body).digest('hex').slice(0, 6);
  const dir = `./db/${h[0]}/${h[1]}`;
  mkdirp.sync(dir);
  writeFile(`${dir}/${h.slice(2)}`, body, (err) => {});

  const readable = createReadStream('./db/metadata/list');
  let hasUrl = false;
  const rl = createInterface({
    input: readable,
  });

  const rlPromise = new Promise((resolve, reject) => {
    rl.on('close', () => resolve('asd'));
    rl.on('abcd', () => resolve('abcd'));
  });
  rl.on('line', (line) => {
    const [url, hash] = line.split(' ');
    if(url === body) {
      hasUrl = true;
      rl.emit('abcd');
      readable.emit('end');
      readable.close();
    }
  });
  await rlPromise;

  if(!hasUrl) {
    writeFile(`./db/metadata/list`, `${body} ${h}\n`, { flag: 'a' }, (err) => {});
  }

  ctx.body = `http://localhost:3000/${h}`;
});

router.delete('/', async (ctx, next) => {
  const { body } = ctx.request;

});

module.exports = router
