// import your node modules
const express = require('express');
const server = express();
server.use(express.json());

const port = 5000;
const postRoutes = require('./routes/postRoutes');

server.use('/api/posts', postRoutes);

server.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
