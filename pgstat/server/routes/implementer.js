const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const request = require('request');
const cheerio = require("cheerio");
const utf8 = require('utf8');
const imageToBase64 = require('image-to-base64');

const fs = require('fs');


const bodyParser = require('body-parser');
const lib_db = require('../libs/db_lib');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

let locals = [{hl: 'en', gl: 'us', mostPopFree: 'Most Popular Free', mostPopPaid: 'Most Popular Free'},
    {hl: 'nl', gl: 'de', mostPopFree: 'Am beliebtesten kostenlos', mostPopPaid: 'Am beliebtesten bezahlt'},
    {hl: 'ru', gl: 'ru', mostPopFree: 'Самые популярные бесплатные', mostPopPaid: 'Самые популярные платные'},
    {hl: 'zh-cn', gl: 'cn', mostPopFree: '最受欢迎免费', mostPopPaid: '最受欢迎的付费'},
    {hl: 'ja', gl: 'jp', mostPopFree: '最も人気のある無料', mostPopPaid: '最も人気のある有料'},
    {hl: 'es-mx', gl: 'mx', mostPopFree: 'Gratis más popular', mostPopPaid: 'Más pagado'},
    {hl: 'ko', gl: 'kr', mostPopFree: '가장 인기있는 무료', mostPopPaid: '가장 인기 있는 유료'},
    {hl: 'fr', gl: 'fr', mostPopFree: 'Gratuit le plus populaire', mostPopPaid: 'Payé le plus populaire'},
    {hl: 'tr', gl: 'tr', mostPopFree: 'En Popüler Ücretsiz', mostPopPaid: 'En Popüler Ücretli'},
    {hl: 'ms', gl: 'my', mostPopFree: 'Paling Popular Percuma', mostPopPaid: 'Berbayar Paling Popular'},
    {hl: 'hi', gl: 'in', mostPopFree: 'सबसे लोकप्रिय मुफ्त', mostPopPaid: 'सर्वाधिक लोकप्रिय भुगतान'},
    {hl: 'pt-br', gl: 'pt', mostPopFree: 'Mais populares grátis', mostPopPaid: 'Mais popular pago'},
    {hl: 'es', gl: 'es', mostPopFree: 'Gratis más popular', mostPopPaid: 'Más pagado'},
    {hl: 'it', gl: 'it', mostPopFree: 'I più popolari gratis', mostPopPaid: 'Più popolare pagato'},
    {hl: 'uk', gl: 'ua', mostPopFree: 'Найпопулярніші безкоштовні', mostPopPaid: 'Найпопулярніші платні'}];

router.get('/getRecords', async function (req, res) {
    let createdRecord = await lib_db.getRecordsArray();
    res.send(createdRecord);
});

router.post('/createRecord', function (req, res) {
    if (req.body) {
        let j = JSON.parse(JSON.stringify(req.body)).length;
        console.log(JSON.parse(JSON.stringify(req.body)))
        let l = locals.length * j;
        let games = JSON.parse(JSON.stringify(req.body));
        for (let key in games) {
            for (let jey in locals) {
                setTimeout(letGrub, l * 5000, games[key], locals[jey]);
                l--
            }
        }
        res.send('got it!');
    } else {
        res.status(400).json({'message': 'error', 'description': 'Partial Content. Not enough data!'})
    }
});

router.post('/createRecordFree', function (req, res) {
    if (req.body) {
        let j = Object.values(JSON.parse(JSON.stringify(req.body))).length;
        console.log(Object.values(JSON.parse(JSON.stringify(req.body))))
        let l = locals.length * j;
        let games = Object.values(JSON.parse(JSON.stringify(req.body)));
        for (let key in games) {
            for (let jey in locals) {
                setTimeout(letGrubCustomFree, l * 5000, games[key], locals[jey]);
                l--
            }
        }
        res.send({success: true});
    } else {
        res.status(400).json({'message': 'error', 'description': 'Partial Content. Not enough data!'})
    }
});

router.post('/createRecordPaid', function (req, res) {
    if (req.body) {
        let j = Object.values(JSON.parse(JSON.stringify(req.body))).length;
        console.log(Object.values(JSON.parse(JSON.stringify(req.body))))
        let l = locals.length * j;
        let games = Object.values(JSON.parse(JSON.stringify(req.body)));
        for (let key in games) {
            for (let jey in locals) {
                setTimeout(letGrubCustomPaid, l * 5000, games[key], locals[jey]);
                l--
            }
        }
        res.send({success: true});
    } else {
        res.status(400).json({'message': 'error', 'description': 'Partial Content. Not enough data!'})
    }
});

router.post('/createRecordAdmin', function (req, res) {
    if (req.body) {
        let j = Object.values(JSON.parse(JSON.stringify(req.body))).length;
        console.log(Object.values(JSON.parse(JSON.stringify(req.body))))
        let l = locals.length * j;
        let games = Object.values(JSON.parse(JSON.stringify(req.body)));
        for (let key in games) {
            for (let jey in locals) {
                setTimeout(letGrub, l * 5000, games[key], locals[jey]);
                l--
            }
        }
        res.send({success: true});
    } else {
        res.status(400).json({
            'message': 'Partial Content. Not enough data!',
            'description': 'Partial Content. Not enough data!'
        })
    }
});

function letGrub(gameData, local) {
    if (gameData) {
        let options = {
            url: gameData + '&hl=' + local.hl + '&gl=' + local.gl,
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
            try {
                console.log('local, game: ', new Date(), local.hl, gameData + '&hl=' + local.hl + '&gl=' + local.gl);
                let $ = cheerio.load(body);
                let listOpt = [];
                $('div[class="IxB2fe"]').find('div > span > div > span').each(function (index, element) {
                    listOpt.push($(element).text());
                });
                //todo get all screenShots ! example work already !!!
                // let listScreens = [];
                // $('div[class="SgoUSc"]').find('button > img').each(function (index, element) {
                //     listScreens.push($(element).attr('src'));
                // });
                // console.log(listScreens)
                finallySaver(gameData, local.hl, local.gl,
                    $('div[class=xSyT2c]').html().split('"')[1],
                    $('div[class=SgoUSc]').html().split('src="')[1].split('"')[0],
                    $('div[class=SgoUSc]').html().split('src="')[2].split('"')[0],
                    $('div[class=SgoUSc]').html().split('src="')[3].split('"')[0],
                    $('div[class=pf5lIe]').html().split('"')[1],
                    $('h1[class=AHFaub]').html().split('<span>')[1].split('</span>')[0],
                    $('div[class=DWPxHb]').html().split('<div jsname="sngebd">')[1].split('</div>')[0],
                    listOpt[1],
                    listOpt[2],
                    $('div[class=qQKdcc]').html().split('">')[4].split('</a>')[0]);
            } catch (err) {
                console.log('Parse error.\nDetail: ', gameData, '\n', err)
            }
        })
    }
}

function letGrubCustomFree(gameData, local) {
    if (gameData) {
        let options = {
            url: gameData + '&hl=' + local.hl + '&gl=' + local.gl,
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
            try {
                console.log('local, game: ', new Date(), local.hl, gameData + '&hl=' + local.hl + '&gl=' + local.gl);
                let $ = cheerio.load(body);
                let listOpt = [];
                $('div[class="IxB2fe"]').find('div > span > div > span').each(function (index, element) {
                    listOpt.push($(element).text());
                });
                //todo get all screenShots ! example work already !!!
                // let listScreens = [];
                // $('div[class="SgoUSc"]').find('button > img').each(function (index, element) {
                //     listScreens.push($(element).attr('src'));
                // });
                // console.log(listScreens)
                finallySaver(gameData, local.hl, local.gl,
                    $('div[class=xSyT2c]').html().split('"')[1],
                    $('div[class=SgoUSc]').html().split('src="')[1].split('"')[0],
                    $('div[class=SgoUSc]').html().split('src="')[2].split('"')[0],
                    $('div[class=SgoUSc]').html().split('src="')[3].split('"')[0],
                    $('div[class=pf5lIe]').html().split('"')[1],
                    $('h1[class=AHFaub]').html().split('<span>')[1].split('</span>')[0],
                    $('div[class=DWPxHb]').html().split('<div jsname="sngebd">')[1].split('</div>')[0],
                    listOpt[1],
                    listOpt[2],
                    local.mostPopFree);
            } catch (err) {
                console.log('Parse error.\nDetail: ', gameData, '\n', err)
            }
        })
    }
}

function letGrubCustomPaid(gameData, local) {
    if (gameData) {
        let options = {
            url: gameData + '&hl=' + local.hl + '&gl=' + local.gl,
            method: 'GET',
            'Content-Type': 'text/plain; charset=utf-8'
        };
        request(options, function (error, response, body) {
            if (error) {
                console.log('Error during load page:', error);
                return
            }
            try {
                console.log('local, game: ', new Date(), local.hl, gameData + '&hl=' + local.hl + '&gl=' + local.gl);
                let $ = cheerio.load(body);
                let listOpt = [];
                $('div[class="IxB2fe"]').find('div > span > div > span').each(function (index, element) {
                    listOpt.push($(element).text());
                });
                finallySaver(gameData, local.hl, local.gl,
                    $('div[class=xSyT2c]').html().split('"')[1],
                    $('div[class=SgoUSc]').html().split('src="')[1].split('"')[0],
                    $('div[class=SgoUSc]').html().split('src="')[2].split('"')[0],
                    $('div[class=SgoUSc]').html().split('src="')[3].split('"')[0],
                    $('div[class=pf5lIe]').html().split('"')[1],
                    $('h1[class=AHFaub]').html().split('<span>')[1].split('</span>')[0],
                    $('div[class=DWPxHb]').html().split('<div jsname="sngebd">')[1].split('</div>')[0],
                    listOpt[1],
                    listOpt[2],
                    local.mostPopPaid);
            } catch (err) {
                console.log('Parse error.\nDetail: ', gameData, '\n', err)
            }
        })
    }
}

// function to encode data to base64 encoded string by url - its to much
function finallySaver(gameUrl, localHl, localGl, localURL, screenShot, screenShot2, screenShot3, localRate, name, descr, weight, instals, genre) {
    // imageToBase64(localURL) // Image URL
    //     .then(
    //         (response) => {
    //             let imageGame = response
    //             imageToBase64(screenShot).then(
    //                 (response) => {
    let uniqueID = crypto.createHash('md5').update(gameUrl + '&hl=' + localHl + '&gl=' + localGl).digest('hex')
    let fin_obj = {
        "id": uniqueID,
        "date": new Date(),
        "name": name,
        "genre": genre,
        "desc": descr,
        "size": weight,
        "instals": instals,
        "gameUrl": gameUrl,
        "fullUrl": gameUrl + '&hl=' + localHl + '&gl=' + localGl,
        "localHl": localHl,
        "localGl": localGl,
        "stars": localRate,
        "image": localURL,
        "screenshots": [screenShot, screenShot2, screenShot3]
    };
    saveIdAssociation(uniqueID, genre, localHl).then()
    saver(fin_obj).then();
    // }
    // )
    //             .catch(
    //                 (error) => {
    //                     console.error('Error during taken screenshot: ', error)
    //                 }
    //             )
    //     }
    // )
    // .catch(
    //     (error) => {
    //         console.error('Error during taken image of game: ', error)
    //     }
    // )
}

async function saver(gameData) {
    await lib_db.createRecord(gameData);
}

async function saveIdAssociation(uniqueID, genre, LocalHl) {
    await lib_db.createIdAssociation(uniqueID, genre, LocalHl);

}

module.exports = router;
