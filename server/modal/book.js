class Book {
  constructor(book) {
    if(!(this instanceof Book)) {
      return new Book(book);
    }
    this.book = {
      ...book,
      insert_date: new Date(),
      update_date: new Date()
    };
  }

  toJson() {
    return this.book;
  }
}

module.exports = Book;