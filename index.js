const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

// Connect to the MongoDB database
mongoose.connect('mongodb://admin:NDYsxr31461@node71790-noed267thur.proen.app.ruk-com.cloud:11804', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Define the book model
const bookSchema = new mongoose.Schema({
  id: Number,
  title: String,
  author: String
});

const Book = mongoose.model('Book', bookSchema);

// API routes
// Create a new book with auto-increase id 1,2,3,4,5...
app.post('/books', async (req, res) => {
  try {
    const lastBook = await Book.findOne().sort({ id: -1 });
    const newId = lastBook ? lastBook.id + 1 : 1;
    const book = new Book({
      id: newId,
      title: req.body.title,
      author: req.body.author
    });
    await book.save();
    res.send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a list of all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.send(books);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a single book by id
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id });
    res.send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a book
app.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id });
    book.title = req.body.title;
    book.author = req.body.author;
    await book.save();
    res.send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
  try {
    const result = await Book.deleteOne({ id: req.params.id });
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(5000, () => {
  console.log('API server is listening on port 5000');
});