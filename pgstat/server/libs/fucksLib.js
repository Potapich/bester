const mongoConfig = require('../config/config_mongo');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

let urlDB = mongoConfig.mongoURL;//'mongodb://' + mongoConfig.user + ':' + mongoConfig.password + '@' + mongoConfig.rootlink_ip + ',' + mongoConfig.secondarylink_ip;
const dbName = mongoConfig.dbName;
let dbo;
let fucksBase;
let arr;

//add/edit new record to game list
async function addFucksUrls(body) {
    try {
        arr = body
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function updateFuckUrl(body) {
    try {
        const newArr = arr.map(obj => {
            if (obj.id === 1) {
                return {...obj, isLive: body.isLive};
            }
            return obj;
        });
        arr = newArr
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function getFuckUrls() {
    try {
        return arr
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

// (function mongo_starter() {
//     MongoClient.connect(urlDB, {   // + '/' + dbName, {
//         useUnifiedTopology: true, useNewUrlParser: true
//     }, function (err, db) {
//         if (err) {
//             console.log(err);
//             return err;
//         } else {
//             console.log("Connected successfully to db");
//             dbo = db.db();
//             fucksBase = dbo.collection(mongoConfig.fucksBase);
//             fucksBase.createIndex({'url': 1});
//
//         }
//     })
// })();

// //add/edit new record to game list
// async function addFucksUrls(body) {
//     try {
//         for (let key in body) {
//             let recordExists = await checkRecordExistence(body[key].url)
//             if (recordExists) {
//                 fucksBase.replaceOne({
//                     url: body[key].url
//                 }, function (err, result){
//                     console.log('err: ', err, 'result: ', result)
//                 });
//             } else {
//                 await fucksBase.insertOne(body);
//             }
//         }
//     } catch (e) {
//         console.log('MONGO_ERROR', e);
//     }
// }
//
// async function updateFuckUrl(body) {
//     try {
//         return await fucksBase.updateOne(
//             { "url": body.url}, // Filter
//             { "isLive": body.isLive} // Update
//         )
//             .then((obj) => {
//                 console.log('Updated - ' + obj);
//             })
//             .catch((err) => {
//                 console.log('Error: ' + err);
//             })
//     } catch (e) {
//         console.log('MONGO_ERROR', e);
//     }
// }
//
// async function getFuckUrls() {
//     try {
//         return await fucksBase.find({'_id': -1}).toArray();
//     } catch (e) {
//         console.log('MONGO_ERROR', e);
//     }
// }
//
// async function checkRecordExistence(url) {
//     try {
//         const dbRequest = await fucksBase.find({'url': url}).toArray();
//         console.log('dbRequest: ', dbRequest)
//         return Boolean(dbRequest.length);
//     } catch (e) {
//         console.log('MONGO_ERROR', e);
//     }
// }


module.exports.addFuckUrls = addFucksUrls
module.exports.getFuckUrls = getFuckUrls
module.exports.updateFuckUrl = updateFuckUrl