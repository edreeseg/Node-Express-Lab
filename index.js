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

 server.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
 });
