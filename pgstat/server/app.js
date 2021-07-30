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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, accept, content-type, user-agent,accept-encoding,accept-language');
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

//rout best grabber
const implementer = require('./routes/implementer');

//rout best unload
const giveoutter = require('./routes/giveoutter');

app.use('/pg_as_best/workout', implementer);

//best getter
app.use('/pg_as_best/giveaway', giveoutter);

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
