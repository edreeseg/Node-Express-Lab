// import your node modules
const express = require('express');
const db = require('./data/db.js');

const server = express();
server.use(express.json());

const port = 5000;

// Separate the endpoints that begin with /api/posts into a separate Express Router.

server.get('/api/posts', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  db.find()
    .then(posts => res.json({ posts }))
    .catch(err =>
      res
        .status(500)
        .json({ error: 'The posts information could not be retrieved' })
    );
});

server.post('/api/posts', (req, res) => {
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

server.get('/api/posts/:id', (req, res) => {
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

server.delete('/api/posts/:id', (req, res) => {
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

server.put('/api/posts/:id', (req, res) => {
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

server.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
