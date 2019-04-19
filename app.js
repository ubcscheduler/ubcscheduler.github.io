const express = require('express');
const path = require('path');
const app = express();
const api = require('./api/router');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use('/api/v1', api);


app.listen(8080, () => console.log('Example app listening on port 8080!'))