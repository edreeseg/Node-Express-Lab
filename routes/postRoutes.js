const express = require('express');
const router = express.Router();
const db = require('../data/db');

router.get('/', (req, res) => {
  db.find()
    .then(posts => res.json({ posts }))
    .catch(err =>
      res
        .status(500)
        .json({ error: 'The posts information could not be retrieved' })
    );
});

router.post('/', (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents)
    return res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  db.insert({ title, contents })
    .then(result => db.findById(result.id))
    .then(post => res.status(201).json({ post: post[0] }))
    .catch(err =>
      res.status(500).json({
        errorMessage:
          'There was an error while saving the post to the database.',
      })
    );
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(post =>
      post.length === 0
        ? res
            .status(404)
            .json({ message: 'The post with the specified ID does not exist.' })
        : res.json({ post })
    )
    .catch(err =>
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved.' })
    );
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  let post;
  db.findById(id)
    .then(result => (post = result))
    .then(db.remove(id))
    .then(n =>
      n
        ? res.json({ deleted: post[0] })
        : res
            .status(404)
            .json({ message: 'The post with the specified ID does not exist.' })
    )
    .catch(err => {
      res.status(500);
      res.json({ error: 'The post could not be removed.' });
    });
});

router.put('/:id', (req, res) => {
  const { title, contents } = req.body;
  const { id } = req.params;
  if (!title || !contents)
    return res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  const update = {
    title,
    contents,
  };
  db.update(id, update)
    .then(n => {
      if (n) return db.findById(id);
      else
        return res
          .status(404)
          .json({ error: 'The post with the specified ID does not exist.' });
    })
    .then(post => res.json({ post }))
    .catch(err =>
      res
        .status(500)
        .json({ error: 'The post information could not be modified.' })
    );
});

module.exports = router;
