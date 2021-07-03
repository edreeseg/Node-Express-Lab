// import your node modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const server = express();
server.use(express.json());
server.use(cors());

const port = process.env.PORT || 5000;

const postRoutes = require('./routes/postRoutes');

server.use('/api/posts', postRoutes);
server.get('/', (req, res) => {
  res.send('Please direct requests to /api/posts endpoint.');
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
