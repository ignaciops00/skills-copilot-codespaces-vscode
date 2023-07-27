//Create web server
const express = require('express');
const app = express();
const router = express.Router();

//MongoDB
const mongoose = require('mongoose');
const db = mongoose.connection;
const url = 'mongodb://localhost:27017/comments';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected correctly to server');
});

//MongoDB schema
const commentSchema = new mongoose.Schema({
  name: String,
  comment: String,
  stars: Number,
  date: String,
});

//MongoDB model
const Comment = mongoose.model('Comment', commentSchema);

//Create a new comment
router.post('/', (req, res) => {
  const newComment = new Comment({
    name: req.body.name,
    comment: req.body.comment,
    stars: req.body.stars,
    date: new Date().toLocaleString(),
  });
  newComment.save(function (err) {
    if (err) return console.error(err);
  });
  res.send('New comment added');
});

// Get all comments
router.get('/', (req, res) => {
  Comment.find({}, function (err, comments) {
    if (err) return console.error(err);
    res.json(comments);
  });
});

//Get a comment by id
router.get('/:id', (req, res) => {
  Comment.findById(req.params.id, function (err, comment) {
    if (err) return console.error(err);
    res.json(comment);
  });
});

//Update a comment
router.put('/:id', (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        comment: req.body.comment,
        stars: req.body.stars,
      },
    },
    function (err) {
      if (err) return console.error(err);
      res.send('Comment updated');
    }
  );
});

//Delete a comment
router.delete('/:id', (req, res) => {
  Comment.findByIdAndDelete(req.params.id, function (err) {
    if (err) return console.error(err);
    res.send('Comment deleted');
  });
});

module.exports = router;