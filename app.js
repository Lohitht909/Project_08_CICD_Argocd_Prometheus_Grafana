// Importing required packages
const http = require('http');
const express = require('express');
const client = require('prom-client');

const app = express();

// Collect default Node.js metrics
client.collectDefaultMetrics();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/app/public'));

require('./app/routes')(app);

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

http.createServer(app).listen(app.get('port'), () => {
    console.log(`The application is running on port ${app.get('port')}`);
});