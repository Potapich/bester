/**
 * Created by Mykhailo Pedash 08.02.2021
 * метод выгрузить все из базы
 * метод удаление из базы
 * метод обновления данных по записи
 * индекс по наименованию
 * индекс ид
 * данные в базе:
 * 1 урл, наименование, локаль, описание..., позиция для вывода дефолтно?
 * при загрузке нового - выгружать данные рейтинга, описания, позиции в топ, жанр, возраст.
 */
const express = require('express');
const cron = require('node-cron');
const jwt = require('jsonwebtoken')
const config = require('./config')
const app = express();
const fs = require('fs');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + "/../public/"));

let server = require('http').createServer(app);

server.listen(config.http_express_port, function () {
    console.log('App listening on port ' + config.http_express_port + '!')
});

// cron.schedule('*/1 * * * *', () => {
//     console.log('running a task every two minutes');
//     get_position()
// });

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://18.116.133.93:8000/');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers',  "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true);
    // try {
    //     if (!jwt.verify(req.query.secr, config.jwtSecret)) {
    next();
    //     } else {
    //         res.status(401).json({'message': 'error', 'description': 'Partial Content. Not enough data!'})
    //     }
    // } catch (e) {
    //     return res.status(401).json({message: 'No authorization'})
    // }
});

app.all('/', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.end('ok');
    } else {
        //move on
        next();
    }
});

app.all('/pg_as_best', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.end('ok');
    } else {
        //move on
        next();
    }
});


app.all('/', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.end('ok');
    } else {
        //move on
        next();
    }
});

app.get(
    ['/detailDelta*', '/simpleDelta*', '/detailSmart*',
        '/runtime*', '/polyfills*', '/styles*', '/main*', '/Exo2*', '/favicon*', '/assets*'],
    function (req, res, next) {
        if (req.url.length > 1) {
            let filePath = req.url;
            let getFileRequest = fs.existsSync(__dirname + '/front/best-games' + filePath);
            if (getFileRequest) {
                let requestFile = fs.readFileSync(__dirname + '/front/best-games' + filePath);
                res.write(requestFile);
                res.end();
            } else {
                res.status(400).json('error');
            }
        } else {
            next();
        }
    }
);

app.get('/admin', function (req, res, next) {
    res.sendFile('index.html', {root: __dirname + '/front/best-games/'});
});

//rout best grabber
const implementer = require('./routes/implementer');

//rout best unload
const giveoutter = require('./routes/giveoutter');

//rout best admin
const adminer = require('./routes/adminer');

app.use('/pg_as_best/workout', implementer);

//best getter
app.use('/pg_as_best/giveaway', giveoutter);

//best admin
app.use('/pg_as_best/adminer', adminer);

app.get('/pgstat/present', function (req, res) {

    let pos_number = links.findIndex(x => x.link.includes('com.MCPEAppzLabz.hulk.games'))
    if (pos_number > -1) {
        res.status(200).json({
            current_position: pos_number + 1
        })
    } else {
        res.status(201).json({
            error: 'something went wrong...'
        })
    }
})
