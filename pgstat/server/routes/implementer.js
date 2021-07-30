const express = require('express');
const router = express.Router();

const request = require('request');
const cheerio = require("cheerio");
const utf8 = require('utf8');
const imageToBase64 = require('image-to-base64');


const bodyParser = require('body-parser');
const lib_db = require('../libs/db_lib');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

let locals = [{hl: 'en', gl: 'us'}, {hl: 'nl', gl: 'de'}, {hl: 'ru', gl: 'ru'}];

router.get('/getRecords', async function (req, res) {
    let createdRecord = await lib_db.getRecordsArray();
    res.send(createdRecord);
});

router.post('/createRecord', function (req, res) {
    if (req.body) {
        let j = JSON.parse(JSON.stringify(req.body)).length - 1;
        while (j !== 0) {
            const promise2 = new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, 1000 + j * 2500);
            });
            promise2.then(() => {
                for (let key in locals) {
                    get_gameInfo(JSON.parse(JSON.stringify(req.body)), locals[key]);//JSON.parse(JSON.stringify(req.body));
                }
            });
            j--
        }
        res.send('got it!');
    } else {
        res.status(400).json({'message': 'error', 'description': 'Partial Content. Not enough data!'})
    }
});


function get_gameInfo(gameData, local) {
    for (let i = gameData.length; i > 0; i--) {
        let index = i;
        const promise1 = new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve(index - 1);
            }, 1000 + i * 5000);
        });
        promise1.then((index) => {
            // console.log(gameData[Math.floor(index / locals.length)] + ', local is ' + locals[Math.floor(index / gameData.length)].hl);
            if (gameData[index]) {
                let options = {
                    url: gameData[index] + '&hl=' + local.hl + '&gl=' + local.gl,
                    method: 'GET',
                    'Content-Type': 'text/plain; charset=utf-8'
                };
                request(options, function (error, response, body) {
                    if (error) {
                        console.log('Error during load page:', error);
                        return
                    }

                    //convert image to base 64 and to base!
                    /**let base64img = urlToBase64_encode('https://play-lh.googleusercontent.com/xOgV-lsJ0C3367TI_ECmWk0Xg27IYRM_srFNe-WC1fYUnzgLIm8Ysz3igpLRkT1M2tI=s180');
                     console.log('base64img', urlToBase64_encode('https://play-lh.googleusercontent.com/xOgV-lsJ0C3367TI_ECmWk0Xg27IYRM_srFNe-WC1fYUnzgLIm8Ysz3igpLRkT1M2tI=s180'));*/

                    let $ = cheerio.load(body);

                    urlToBase64_encode(gameData[index], local.hl, local.gl,
                        $('div[class=xSyT2c]').html().split('"')[1],
                        $('div[class=pf5lIe]').html().split('"')[1],
                        $('h1[class=AHFaub]').html().split('<span>')[1].split('</span>')[0],
                        $('div[class=qQKdcc]').html().split('">')[4].split('</a>')[0]);
                })
            }
        });
    }
}

// function to encode data to base64 encoded string by url
function urlToBase64_encode(gameUrl, localHl, localGl, localURL, localRate, name, genre) {
    imageToBase64(localURL) // Image URL
        .then(
            (response) => {
                let fin_obj = {
                    "date": new Date(),
                    "name": name,
                    "genre": genre,
                    "gameUrl": gameUrl,
                    "fullUrl": gameUrl + '&hl=' + localHl + '&gl=' + localGl,
                    "localHl": localHl,
                    "localGl": localGl,
                    "rating": localRate,
                    "image": response
                };
                saver(fin_obj).then(r => console.log('saver worked!'));
            }
        )
        .catch(
            (error) => {
                console.error(error)
            }
        )
}

async function saver(gameData) {
    // let data = await get_gameInfo(JSON.parse(JSON.stringify(req.body)));//JSON.parse(JSON.stringify(req.body));
    await lib_db.createRecord(gameData);
    // lib_db.insertLog('vocabulary', 'vocabulary', 'Create record to vocabulary', data.type, data, 'createRecord');
    // let createdRecord = await lib_db.getRecordsArray();
    console.log('finished')//, createdRecord)
}

module.exports = router;
