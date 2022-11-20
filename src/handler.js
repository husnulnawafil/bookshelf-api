/* eslint-disable dot-notation */
/* eslint-disable guard-for-in */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (name === '' || name === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = res.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    updatedAt,
    finished,
    insertedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = res.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = res.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (req, res) => {
  // eslint-disable-next-line prefer-const
  let { reading, finished, name } = req.query;
  if (reading !== undefined) {
    reading = reading === '1';
    const filteredBooks = books.filter((data) => data.reading === reading);
    // eslint-disable-next-line prefer-const
    let data = [];
    filteredBooks.forEach((book) => {
      const dataMap = {};
      dataMap['id'] = book['id'];
      dataMap['name'] = book['name'];
      dataMap['publisher'] = book['publisher'];
      data.push(dataMap);
    });
    const response = res.response({
      status: 'success',
      data: {
        books: data,
      },
    });
    response.code(200);
    return response;
  }

  if (finished !== undefined) {
    finished = finished === '1';
    const filteredBooks = books.filter((data) => data.finished === finished);
    // eslint-disable-next-line prefer-const
    let data = [];
    filteredBooks.forEach((book) => {
      const dataMap = {};
      dataMap['id'] = book['id'];
      dataMap['name'] = book['name'];
      dataMap['publisher'] = book['publisher'];
      data.push(dataMap);
    });
    const response = res.response({
      status: 'success',
      data: {
        books: data,
      },
    });
    response.code(200);
    return response;
  }

  if (name !== undefined) {
    // eslint-disable-next-line max-len
    const filteredBooks = books.filter((data) => data.name.toLowerCase().includes(name.toLowerCase()));
    // eslint-disable-next-line prefer-const
    let data = [];
    filteredBooks.forEach((book) => {
      const dataMap = {};
      dataMap['id'] = book['id'];
      dataMap['name'] = book['name'];
      dataMap['publisher'] = book['publisher'];
      data.push(dataMap);
    });
    const response = res.response({
      status: 'success',
      data: {
        books: data,
      },
    });
    response.code(200);
    return response;
  }
  // eslint-disable-next-line prefer-const
  let data = [];

  books.forEach((book) => {
    const dataMap = {};
    dataMap['id'] = book['id'];
    dataMap['name'] = book['name'];
    dataMap['publisher'] = book['publisher'];
    data.push(dataMap);
  });

  const response = res.response({
    status: 'success',
    data: {
      books: data,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (req, res) => {
  const { id } = req.params;
  const book = books.filter((data) => data.id === id)[0];
  if (book !== undefined) {
    return ({
      status: 'success',
      data: {
        book,
      },
    });
  }
  const response = res.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBookByIdHandler = (req, res) => {
  const { id } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (name === '' || name === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = res.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    };

    const book = books.filter((data) => data.id === id)[0];

    const response = res.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = res.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (req, res) => {
  const { id } = req.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);

    const response = res.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = res.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const getAllReadingBook = (req, res) => {
  let { reading } = req.query;
  reading = reading === '1';
  const filteredBooks = books.filter((data) => data.reading === reading);
  // eslint-disable-next-line prefer-const
  let data = [];

  filteredBooks.forEach((book) => {
    const dataMap = {};
    dataMap['id'] = book['id'];
    dataMap['name'] = book['name'];
    dataMap['publisher'] = book['publisher'];
    data.push(dataMap);
  });

  const response = res.response({
    status: 'success',
    data: {
      books: data,
    },
  });
  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
  getAllReadingBook,
};
