const axios = require('axios');
const db = require('../lib/db');
const config = require('kelp-config');
const Book = require('../modal/book');
const { log } = require('../lib/utils');

let { isbnApi, fields } = config.douban.book;

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// const jsbook = {
//   rating: { max: 10, numRaters: 87, average: '9.5', min: 0 },
//   isbn13: '9787121317989',
//   pubdate: '2017-7-1',
//   author: [ '【美】Nicholas C. Zakas' ],
//   image: 'https://img1.doubanio.com/view/subject/m/public/s29478358.jpg',
//   publisher: '电子工业出版社',
//   id: '27072230',
//   translator: [ '刘振涛' ],
//   images:{
//     small: 'https://img1.doubanio.com/view/subject/s/public/s29478358.jpg',
//     large: 'https://img1.doubanio.com/view/subject/l/public/s29478358.jpg',
//     medium: 'https://img1.doubanio.com/view/subject/m/public/s29478358.jpg'
//   },
//   title: '深入理解ES6',
//   pages: ''
// };

async function queryBookByISBN() {
  const isbn = this.params.isbn;
  log(`recieve request, isbn: ${isbn}`);
  // this.body = jsbook;
  let url = isbnApi.replace(/:isbn/, isbn) + '?fields=' + fields;
  await axios.get(url)
    .then(res => {
      this.body = res.data;
    })
    .catch(err => {
      let message = err.message;
      log(`fetch book info failed, isbn: ${isbn},message: ${err.message}`, true);
      if ((err.status + '').startsWith('4')) {
        message = '豆瓣 api 请求超限，下个整点后才能用';
      }
      throw new Error({ status: err.status, message });
    });
}

async function query(){
  let books = await db.search({
    title: new RegExp(escapeRegex(this.query.title), 'gi')
  });
  this.body = books.map(book => {
    delete book._id;
    delete book.update_date;
    delete book.insert_date;
    return book;
  });
}

async function queryAll(){
  let books = await db.search({});
  this.body = books.map(book => {
    delete book._id;
    delete book.update_date;
    delete book.insert_date;
    return book;
  });
}

async function queryOne() {
  this.body = await db.search({ name: this.params.name });
}

async function addBook() {
  try{
    const { book } = this.request.body;
    if(await db.exist(book.isbn13)) {
      this.body = { message: '此书已存在' };
    } else {
      await db.add(new Book(book).toJson());
      this.status = 204;
    }
  }catch(e) {
    this.status = 500;
    this.body = e.message;
  }

}

async function updateBook() {
  this.status = 204;
}

async function deleteBook() {
  await db.delete(this.params.isbn);
  this.status = 204;
}

module.exports = {
  query,
  queryAll,
  queryOne,
  queryBookByISBN,
  addBook,
  updateBook,
  deleteBook
};