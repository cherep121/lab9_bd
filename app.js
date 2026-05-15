const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Article = require('./models/Article');

const app = express();
const PORT = 3000;
const mongoURI = 'mongodb://127.0.0.1:27017/lab9_journal';

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(mongoURI);

app.get('/', async (req, res) => {
  let articles = [];
  let searchTitle = '';
  let selectedAuthor = '';

  if (req.query.action === 'list') {
    articles = await Article.find();
  } 
  else if (req.query.action === 'search' && req.query.title) {
    searchTitle = req.query.title;
    articles = await Article.find({ title: { $regex: searchTitle, $options: 'i' } });
  }
  else if (req.query.action === 'filterAuthor' && req.query.author) {
    selectedAuthor = req.query.author;
    articles = await Article.find({ authors: selectedAuthor });
  }

  const allArticles = await Article.find();
  const authorsSet = new Set();
  allArticles.forEach(art => art.authors.forEach(a => authorsSet.add(a)));
  const authorsList = Array.from(authorsSet).sort();

  res.render('index', { articles, searchTitle, selectedAuthor, authorsList });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});