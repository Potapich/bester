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
const config = require('./config')
const app = express();
const lib_db = require('./libs/fucksLib')

let server = require('http').createServer(app);

server.listen(config.http_express_port_fuck, function () {
    console.log('App listening on port ' + config.http_express_port_fuck + '!')
});

app.get('/letsFuckRussianMilitaryShip', async function (req, res, next) {
    let records = await lib_db.getFuckUrls();
    res.send(records);
});

app.post('/addFuckers', async function (req, res, next) {
    let strPass = req.query.meparam;
    if ((strPass.length % 4) == 0 && (strPass.charAt(strPass.length / 4 - 1) == 'x' && strPass.charAt((strPass.length / 4) * 2 - 1) == 'y' && strPass.charAt((strPass.length / 4) * 3 - 1) == 'u')) {
        await addFuckUrls(req.body)
        res.status(200).json({status: 'Great job! Lets fuck them all!!!'});
    } else {
        res.status(200).json({
            error: 'Fuck off!',
        });
    }
});

app.post('/updateFuckers', async function (req, res, next) {
    let strPass = req.query.meparam;
    if ((strPass.length % 4) == 0 && (strPass.charAt(strPass.length / 4 - 1) == 'x' && strPass.charAt((strPass.length / 4) * 2 - 1) == 'y' && strPass.charAt((strPass.length / 4) * 3 - 1) == 'u')) {
        await updateFuckUrl(req.body)
        res.status(200).json({status: 'Great updating job! Lets fuck them all!!!'});
    } else {
        res.status(200).json({
            error: 'Fuck off!',
        });
    }
});

async function addFuckUrls(body) {
    await lib_db.addFuckUrls(body);

}

async function updateFuckUrl(body) {
    await lib_db.updateFuckUrl(body);
}

