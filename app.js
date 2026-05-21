const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Article = require('./models/Article');

const app = express();
const PORT = 3000;
const mongoURI = 'mongodb://127.0.0.1:27017/lab9_journal';

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(mongoURI);

app.get('/', async (req, res) => {
  let articles = [];
  let searchTitle = '';
  let selectedAuthor = '';
  let startDate = '';
  let endDate = '';

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
  else if (req.query.action === 'dateRange' && req.query.startDate && req.query.endDate) {
    startDate = req.query.startDate;
    endDate = req.query.endDate;
    articles = await Article.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });
  }

  const allArticles = await Article.find();
  const authorsSet = new Set();
  allArticles.forEach(art => art.authors.forEach(a => authorsSet.add(a)));
  const authorsList = Array.from(authorsSet).sort();

  res.render('index', { 
    articles, 
    searchTitle, 
    selectedAuthor, 
    authorsList,
    startDate,
    endDate
  });
});

app.get('/article/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).send('Статья не найдена');
    res.render('article', { article });
  } catch (err) {
    res.status(500).send('Ошибка');
  }
});

app.delete('/article/:id', async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/create', async (req, res) => {
  try {
    const { title, authors, content, tags } = req.body;
    const authorsArray = authors.split(',').map(a => a.trim());
    const tagsArray = tags ? tags.split(',').map(t => t.trim()) : [];
    
    const newArticle = new Article({
      title,
      authors: authorsArray,
      content,
      tags: tagsArray,
      reviews: []
    });
    await newArticle.save();
    res.redirect('/?action=list');
  } catch (err) {
    res.status(500).send('Ошибка при создании');
  }
});

app.get('/top', async (req, res) => {
  const articles = await Article.find();
  
  const articlesWithStats = articles.map(article => {
    const reviews = article.reviews || [];
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    return {
      ...article._doc,
      avgRating,
      commentsCount: reviews.length
    };
  });
  
  articlesWithStats.sort((a, b) => {
    if (a.avgRating !== b.avgRating) return b.avgRating - a.avgRating;
    return b.commentsCount - a.commentsCount;
  });
  
  const topArticles = articlesWithStats.slice(0, 5);
  res.render('top', { topArticles });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});