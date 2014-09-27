var main = require('./server/server.js'),
	express = require('express');

app = express();
app.use(express.static(__dirname + "/"));

main(app);