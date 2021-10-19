const mongoConfig = require('../config/config_mongo');
const MongoClient = require('mongodb').MongoClient;

let urlDB = mongoConfig.mongoURL;//'mongodb://' + mongoConfig.user + ':' + mongoConfig.password + '@' + mongoConfig.rootlink_ip + ',' + mongoConfig.secondarylink_ip;
const dbName = mongoConfig.dbName;
let dbo;
let bestCollection;
let assocCollection;
let logsCollection;
let bestCollectionMain;

(function mongo_starter() {
    MongoClient.connect(urlDB, {   // + '/' + dbName, {
        useUnifiedTopology: true, useNewUrlParser: true
    }, function (err, db) {
        if (err) {
            console.log(err);
            return err;
        } else {
            console.log("Connected successfully to db");
            dbo = db.db();
            bestCollection = dbo.collection(mongoConfig.bestCollection);
            assocCollection = dbo.collection(mongoConfig.assocCollection);
            bestCollectionMain = dbo.collection(mongoConfig.mainCollection);
            bestCollectionMain.createIndex({'LocalHl': 1});
            bestCollection.createIndex({'gameUrl': 1});
            bestCollection.createIndex({'fullUrl': 1});
            bestCollection.createIndex({'localHl': 1});
            bestCollection.createIndex({'localGl': 1});
            bestCollection.createIndex({'genre': 1});
            assocCollection.createIndex({'genre': 1});
            assocCollection.createIndex({'LocalHl': 1});
        }
    })
})();

//add/edit new record to game list
async function createRecord(record) {
    try {
        const recordExists = await checkRecordExistence(record.fullUrl);
        if (recordExists) {
            bestCollection.replaceOne({
                fullUrl: record.fullUrl
            }, record);
        } else {
            await bestCollection.insertOne(record);
        }
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function checkRecordExistence(fullUrl) {
    try {
        const dbRequest = await bestCollection.find({'fullUrl': fullUrl}).toArray();
        return Boolean(dbRequest.length);
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function getRecordsByGenre(localHl, genre) {
    try {
        return await bestCollection.find({'genre': genre, 'localHl': localHl}).toArray();;
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function getRecordsByLocalHl(localHl) {
    try {
        return await bestCollection.find({'localHl': localHl}, {
            projection:{ _id: 0 }
        }).toArray();
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function getRecordsByLocalGl(localGl) {
    try {
        return await bestCollection.find({'localGl': localGl}).toArray();
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function getMainByLocalHl(LocalHl) {
    try {
        return await bestCollectionMain.find({'local': LocalHl}, {
            projection:{ _id: 0 }
        }).toArray();
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function getCatalogByLocalHl(LocalHl) {
    try {
        return await assocCollection.find({'LocalHl': LocalHl}, {
            projection:{ _id: 0 }
        }).toArray();
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}


async function getRecordsArray() {
    try {
        return await bestCollection.find({}).toArray();
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function deleteRecord(fullUrl) {
    try {
        const recordExists = await checkRecordExistence(fullUrl);
        if (recordExists) {
            await bestCollection.deleteOne({fullUrl: fullUrl});
        }
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

//logging
function insertLog(adminName, user, action, system, description) {
    try {
        logsCollection.insertOne({
            adminName,
            user,
            action,
            system,
            description,
            createdAt: new Date()
        });
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function createIdAssociation(uniqueID, genre, LocalHl) {
    try {
        console.error('uniqueID:', uniqueID)

        assocCollection.find({"genre": genre}).toArray(function (err, result) {
            if (typeof result !== "undefined" && result.length > 0) {
                console.log('same genre: ', genre, uniqueID)
                var newArr = [uniqueID];
                var nowArr = result[0].games;

                var tempArr = newArr.concat(nowArr)
                var lastArr = tempArr.filter((item, pos) => tempArr.indexOf(item) === pos)

                assocCollection.updateOne({genre: genre}, {
                    $set: {
                        "games": lastArr,
                    }
                })
            } else {
                console.log('new genre: ', genre, uniqueID)
                let gameArray = [uniqueID];
                assocCollection.insertOne({
                    "genre": genre,
                    "LocalHl": LocalHl,
                    "games": gameArray
                });
            }
        });
    } catch (e) {
        console.log('MONGO_ERROR update assoc', e);
    }
}

module.exports.insertLog = insertLog;
module.exports.createRecord = createRecord;
module.exports.getRecordsByLocalHl = getRecordsByLocalHl;
module.exports.getRecordsArray = getRecordsArray;
module.exports.getRecordsByGenre = getRecordsByGenre;
module.exports.getRecordsByLocalGl = getRecordsByLocalGl;
module.exports.deleteRecord = deleteRecord;
module.exports.createIdAssociation = createIdAssociation;
module.exports.getMainByLocalHl = getMainByLocalHl;
module.exports.getCatalogByLocalHl = getCatalogByLocalHl;