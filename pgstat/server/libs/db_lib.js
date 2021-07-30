const mongoConfig = require('../config/config_mongo');
const MongoClient = require('mongodb').MongoClient;

let urlDB = mongoConfig.mongoURL;//'mongodb://' + mongoConfig.user + ':' + mongoConfig.password + '@' + mongoConfig.rootlink_ip + ',' + mongoConfig.secondarylink_ip;
const dbName = mongoConfig.dbName;
let dbo;
let bestCollection;
let logsCollection;

(function mongo_starter() {
    MongoClient.connect(urlDB, {   // + '/' + dbName, {
        useUnifiedTopology: true, useNewUrlParser: true
    }, function (err, db) {
        if (err) {
            console.log(err);
            return err;
        } else {
            console.log("Connected successfully to server");
            dbo = db.db();
            bestCollection = dbo.collection(mongoConfig.bestCollection);
            bestCollection.createIndex({'gameUrl': 1});
            bestCollection.createIndex({'fullUrl': 1});
            bestCollection.createIndex({'localHl': 1});
            bestCollection.createIndex({'localHl': 1});
            bestCollection.createIndex({'genre': 1});
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
        const records = await bestCollection.find({'genre': genre, 'localHl': localHl}).toArray();
        return records;
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function getRecordsByLocalHl(localHl) {
    try {
        const records = await bestCollection.find({'localHl': localHl}).toArray();
        return records;
    } catch (e) {
        console.log('MONGO_ERROR', e);
    }
}

async function getRecordsByLocalGl(localGl) {
    try {
        const records = await bestCollection.find({'localGl': localGl}).toArray();
        return records;
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

module.exports.insertLog = insertLog;
module.exports.createRecord = createRecord;
module.exports.getRecordsByLocalHl = getRecordsByLocalHl;
module.exports.getRecordsArray = getRecordsArray;
module.exports.getRecordsByGenre = getRecordsByGenre;
module.exports.getRecordsByLocalGl = getRecordsByLocalGl;
module.exports.deleteRecord = deleteRecord;