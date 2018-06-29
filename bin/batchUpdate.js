#!/usr/bin/env node
// 批量更新数据库中的书本信息

const axios = require('axios');
const { isbnApi, fields } = require('kelp-config').douban.book;
const db = require('../server/lib/db');
const { log, loge } = require('../server/lib/utils');

const agent = axios.create({
  timeout: 10000,
});

const WAIT = 30000; // 豆瓣API限制 150 次/小时，设定为每30秒更新一次

async function update() {
  let count = 0;
  let books = await db.search({});
  let total = books.length;
  let failed = [];
  log('书本数量：' + books.length);

  const tick = setInterval(async () => {
    let book = books.shift();
    log(`开始更新第 ${++count} 本, 《${book.title}》, isbn: ${book.isbn13}`);
    await agent.get(isbnApi.replace(/:isbn/, book.isbn13) + '?fields=' + fields)
      .then(async res => {
        await db.update(book.isbn13, res.data);
        log('√');
      })
      .catch(err => {
        loge('x,' + err.message);
        failed.push(book.isbn13);
      });

    if (count === total) {
      log('-----更新结束-----');
      if(failed.length){
        log('Failed isbns: ' + failed.join(','));
      }
      clearInterval(tick);
      process.exit();
    }
  }, WAIT);
}
log('-----批量更新书本信息-----');

setTimeout(update, 3000); // 等数据库连接上
