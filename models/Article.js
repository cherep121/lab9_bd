const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: [String],
  date: { type: Date, default: Date.now },
  content: String,
  tags: [String],
  reviews: [
    {
      name: String,
      message: String,
      rating: { type: Number, min: 1, max: 10 }
    }
  ]
});

module.exports = mongoose.model('Article', articleSchema);