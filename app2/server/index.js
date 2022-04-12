import fs from 'fs';
import path from 'path';
import express from 'express';

import React from 'react';
import { HashRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import App from '../src/App';
const app = express();

app.get('/*', (req, res) => {
    const renderedString = renderToString(
        // <HashRouter>
        <App></App>
        // </HashRouter>
    );

    fs.readFile(path.resolve('dist/index.html'), 'utf8', (error, data) => {
        if (error) {
            res.send(`<p>Server Error</p>`);
            return false;
        }

        res.send(data.replace('<div id="root"></div>', `<div id="root">${renderedString}</div>`));
    });
});

app.listen(3000);
