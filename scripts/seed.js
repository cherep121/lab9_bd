const mongoose = require('mongoose');
const Article = require('../models/Article');

const mongoURI = 'mongodb://127.0.0.1:27017/lab9_journal';

const sampleArticles = [
  {
    title: 'Введение в Node.js',
    authors: ['Иванов И.И.'],
    content: 'Статья про Node.js',
    tags: ['nodejs', 'backend'],
    reviews: [{ name: 'Анна', message: 'Отлично', rating: 9 }]
  },
  {
    title: 'MongoDB для начинающих',
    authors: ['Петров П.П.', 'Сидоров С.С.'],
    content: 'Основы MongoDB',
    tags: ['mongodb', 'базы данных'],
    reviews: []
  },
  {
    title: 'Express фреймворк',
    authors: ['Смирнова А.А.'],
    content: 'Работа с Express',
    tags: ['express', 'nodejs'],
    reviews: [{ name: 'Максим', message: 'Полезно', rating: 8 }]
  },
  {
    title: 'REST API с Node.js',
    authors: ['Иванов И.И.', 'Козлов К.К.'],
    content: 'Создание API',
    tags: ['api', 'rest'],
    reviews: []
  },
  {
    title: 'Теги и рецензии в MongoDB',
    authors: ['Зайцева Е.Е.'],
    content: 'Проектирование схем',
    tags: ['mongodb', 'schema'],
    reviews: [{ name: 'Гость', message: 'Хороший пример', rating: 7 }]
  }
];

async function seedDB() {
  try {
    await mongoose.connect(mongoURI);
    await Article.deleteMany();
    await Article.insertMany(sampleArticles);
    console.log('✅ Добавлено 5 статей');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedDB();