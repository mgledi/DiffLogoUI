const path = require('path');
const express = require('express');
const router = express.Router();

const OPTIONS = require('../options');

module.exports = function defaultRouter(middleware, PRODUCTION) {
    router.get('/', (req, res) => {
        if (PRODUCTION) {
            res.sendFile(path.join(process.cwd(), 'ui/index.html'));
        } else {
            res.write(middleware.fileSystem.readFileSync(path.join(process.cwd(), 'dist/ui/index.html')));
            res.end();
        }
    });

    router.get('/options', (req, res) => {
        res.json(OPTIONS);
    });

    return router;
};
