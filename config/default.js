const path = require('path');

module.exports = {
  path: {
    routes: path.join(__dirname, '../server/routes.js'),
    controllers: path.join(__dirname, '../server/controllers'),
  },
  serve: {
    port: 3000
  },
  db: {
    host: '127.0.0.1',
    port: '27017',
    database: 'bookshelf',
    collection: 'books'
  },
  douban: {
    book: {
      idApi: 'https://api.douban.com/v2/book/:id',
      isbnApi: 'https://api.douban.com/v2/book/isbn/:isbn',
      fields: 'id,isbn13,title,origin_title,alt_title,subtitle,alt,author,translator,rating,publisher,pubdate,pages,image,images,price,binding,series,tags'
    }
  }
};