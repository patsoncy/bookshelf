get /api/get => api#query
get /api/getall => api#queryAll
get /api/book/:name => api#queryOne
get /api/book/scan/:isbn => api#queryBookByISBN

post /api/book/add => api#addBook
put /api/book/:isbn => api#updateBook
delete /api/book/:isbn => api#deleteBook