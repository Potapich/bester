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

let locals = [{hl: 'en', gl: 'us'}, {hl: 'nl', gl: 'de'}, {hl: 'ru', gl: 'ru'},
    {hl: 'zh-cn', gl: 'cn'}, {hl: 'ja', gl: 'jp'}, {hl: 'es-mx', gl: 'mx'},
    {hl: 'ko', gl: 'kr'}, {hl: 'fr', gl: 'fr'}, {hl: 'tr', gl: 'tr'},
    {hl: 'ms', gl: 'my'}, {hl: 'hi', gl: 'in'}, {hl: 'pt-br', gl: 'pt'},
    {hl: 'es', gl: 'es'}, {hl: 'it', gl: 'it'}, {hl: 'uk', gl: 'ua'}];

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

// function gameCount(body) {
//     console.log('i am gameCount')
//     let l = locals.length;
//     for (let key in locals) {
//         console.log('i am locals')
//         for (let i = body.length; i > 0; i--) {
//             console.log('i am req', l, i)
//             setTimeout(letGrub, 2000 + l*1000, body, i, locals[key]);
//             l--
//         }
//     }
// }

// function get_gameInfo(gameData, local) {
//     console.log('i am get_gameInfo', gameData.length)
//     for (let i = gameData.length; i > 0; i--) {
//         setTimeout(letGrub, 3000 + i * 1000, gameData, i - 1, local);
//     }
// }

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

// function get_gameInfo(gameData, local) {
//     for (var i = gameData.length; i > 0; i--) {
//         var index = gameData.length - 1;
//         setTimeout(doIt, 2000 + i * 2000);
//     };
//
//     function doIt() {
//         if (gameData[index]) {
//             let options = {
//                 url: gameData[index] + '&hl=' + local.hl + '&gl=' + local.gl,
//                 method: 'GET',
//                 'Content-Type': 'text/plain; charset=utf-8'
//             };
//             request(options, function (error, response, body) {
//                 console.log('Resp done ', gameData[index] + '&hl=' + local.hl + '&gl=' + local.gl);
//                 fs.appendFileSync(__dirname + "/../../logs/logs.log", `Resp done, ${gameData[index]} &hl=  ${local.hl} &gl= ${local.gl} in ${new Date()} \n`)
//                 if (error) {
//                     console.log('Error during load page:', error);
//                     return
//                 }
//
//                 //convert image to base 64 and to base!
//                 /**let base64img = urlToBase64_encode('https://play-lh.googleusercontent.com/xOgV-lsJ0C3367TI_ECmWk0Xg27IYRM_srFNe-WC1fYUnzgLIm8Ysz3igpLRkT1M2tI=s180');
//                  console.log('base64img', urlToBase64_encode('https://play-lh.googleusercontent.com/xOgV-lsJ0C3367TI_ECmWk0Xg27IYRM_srFNe-WC1fYUnzgLIm8Ysz3igpLRkT1M2tI=s180'));*/
//                 try {
//                     let $ = cheerio.load(body);
//                     let listOpt = [];
//                     $('div[class="IxB2fe"]').find('div > span > div > span').each(function (index, element) {
//                         listOpt.push($(element).text());
//                     });
//                     //todo get all screenShots ! example work already !!!
//                     // let listScreens = [];
//                     // $('div[class="SgoUSc"]').find('button > img').each(function (index, element) {
//                     //     listScreens.push($(element).attr('src'));
//                     // });
//                     // console.log(listScreens)
//                     urlToBase64_encode(gameData[index], local.hl, local.gl,
//                         $('div[class=xSyT2c]').html().split('"')[1],
//                         $('div[class=SgoUSc]').html().split('src="')[1].split('"')[0],
//                         $('div[class=pf5lIe]').html().split('"')[1],
//                         $('h1[class=AHFaub]').html().split('<span>')[1].split('</span>')[0],
//                         $('div[class=DWPxHb]').html().split('<div jsname="sngebd">')[1].split('</div>')[0],
//                         listOpt[1],
//                         listOpt[2],
//                         $('div[class=qQKdcc]').html().split('">')[4].split('</a>')[0]);
//                 } catch (err) {
//                     console.log('Parse error.\nDetail: ', gameData[index], '\n', err)
//                 }
//             })
//
//         }
//     };
// }

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
