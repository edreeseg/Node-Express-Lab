// import your node modules
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./data/db.js');

const server = express();
server.use(bodyParser.json());

const port = 5000;

server.get('/api/posts', (req, res) => {
    db.find().then(posts => res.send({ posts }))
        .catch(err => {
            console.log(err);
            res.status(500);
            res.send({ error: 'The posts information could not be retrieved' });
        });
});

server.post('/api/posts', (req, res) => {
    const [ title, contents ] = [ req.body.title, req.body.contents ];
    if (!title || !contents){
        res.status(400);
        res.json({ errorMessage: 'Please provide title and contents for the post.' });
        return;
    }
    db.insert({ title, contents })
        .then(result => {
            res.status(201);
            db.findById(result.id)
                .then(post => res.json(post))
                .catch(error => {
                    res.status(500);
                    res.json({ errorMessage: 'There was an error after saving the post to the database.' });
                });
        }).catch(err => {
            res.status(500);
            res.json({ errorMessage: 'There was an error while saving the post to the database.' });
        });

});

server.get('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(post => {
            if (post.length === 0){
                res.status(404);
                res.json({ message: 'The post with the specified ID does not exist.' });
            } else {
                res.json({ post });
            }
        })
        .catch(err => {
            res.status(500);
            res.json({ error: 'The post information could not be retrieved.'});
        });
});

server.delete('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(post => {
            if (post.length === 0){
                res.status(404);
                res.json({ message: 'The post with the specified ID does not exist.' });
            } else {
                db.remove(id)
                    .then(result => {
                        res.json(post);
                    })
                    .catch(err => {
                        res.status(500);
                        res.json({ error: 'The post could not be removed.' });
                    });
            }
        })
        .catch(err => {
            res.status(500);
            res.json({ error: 'The post could not be removed.' });
        });
});

server.put('/api/posts/:id', (req, res) => {
    const [ title, contents, id ] = [ req.body.title, req.body.contents, req.params.id ];
    if (!title || !contents){
        res.status(400);
        res.json({ errorMessage: 'Please provide title and contents for the post.' });
        return;
    }
    db.findById(id)
        .then(post => {
            if (post.length === 0){
                res.status(404);
                res.json({ message: 'The post with the specified ID does not exist.' });
                return;
            }
            const update = { title, contents, updated_at: `${Date().substring(0, 33)} (EST)` };
            db.update(id, update)
                .then(result => {
                    res.json({...post[0], ...update});
                })
                .catch(err => {
                    res.status(500);
                    res.json({ error: 'The post information could not be modified' });
                });
        })
        .catch(err => {
            res.status(500);
            res.json({ error: 'The post information could not be modified' });
        });
});

 server.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
 });
