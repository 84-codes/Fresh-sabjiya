'use strict'

const http = require('http');
const fs = require('fs');
const url = require('url')

const replaceTemplate = require('./custom_modules/template_replace');

const data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const server = http.createServer((req, res) => {
    console.log('requesting!');
    const { query, pathname } = url.parse(req.url, true);
    console.log(pathname)

    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'content-type': 'text/html' });

        // for each element in dataObj (JSON), create a card html, from the standard templateCard

        const cards_html = dataObj.map(el => replaceTemplate(templateCard, el)).join('');
        const overview_html = templateOverview.replace('{%PRODUCT_CARDS%}', cards_html);
        res.end(overview_html);
    }
    else if (pathname === '/product') {

        if (dataObj[query.id]) {
            res.writeHead(200, { 'content-type': 'text/html' });
            const product_queried = dataObj[query.id];
            const product_html = replaceTemplate(templateProduct, product_queried);
            res.end(product_html);
        }
        else {
            res.writeHead(400, { "content-type": 'text/html' });
            res.end('Invalid product!!')
        }
    }
    else {
        res.writeHead(404, { 'content-type': 'text/html' });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening requests.')
});
