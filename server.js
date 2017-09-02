// var company = require('./test_proj')
// var express = require('express');
// var bodyParser = require("body-parser");

// var app = express();
// var d;
// var urlencodedParser = bodyParser.urlencoded({extended: false});
// app.use(express.static(__dirname + "/company"));

// app.get("/", function(request, response){   
//     response.send('')
// });
// app.post('/', urlencodedParser, function (req, res) {
//     if(!req.body) return res.sendStatus(400);
//     d = req.body.day;
//     res.send(company.LetsWork(d))
// });

// app.listen(3000)

const http = require('http');
const fs = require('fs');
const path = require('path');
const company = require('./company')
const url = require('url');

http.createServer((req,res) => {
    if (req.url === '/'){
        res.writeHead(200, {'Content-Type': 'text/html'});
        const strem = fs.createReadStream(path.join(__dirname, 'form.html'))
        strem.pipe(res);
    } if (req.url.startsWith('/statistic')){
        const _get = url.parse(req.url, true).query;
        console.log(_get);
        const statistic = JSON.parse(company.LetsWork(_get.day));
        res.end(`Days (${_get.day})\nCompleted projects: ${statistic.completed}\nHired Employees: ${statistic.hired}\nFired Employees: ${statistic.fired}`);
    }

}).listen(3000, () => console.log("server run"));