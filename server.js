const http = require('http');
const fs = require('fs');
const path = require('path');
const company = require('./company')
const url = require('url');

http.createServer((req,res) => {
    if (req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        const strem = fs.createReadStream(path.join(__dirname, 'form.html'))
        strem.pipe(res);
    } if (req.url.startsWith('/statistic')) {
        const _get = url.parse(req.url, true).query;
        const statistic = company.LetsWork(_get.day);
        res.end(statistic);
        //const statistic = JSON.parse(company.LetsWork(_get.day));
        //res.end(`Days (${statistic.days})\nCompleted projects: ${statistic.completed}\nHired Employees: ${statistic.hired}\nFired Employees: ${statistic.fired}`);
    }

}).listen(3000, () => console.log("server run"));