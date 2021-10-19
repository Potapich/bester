const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const sv_db = require('../libs/db_lib');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.get('/getDataRecords', async function (req, res) {
    let records = await sv_db.getRecordsArray();
    res.send(records);
});

router.get('/getRecords', async function (req, res) {
    let records = await sv_db.getRecordsArray();
    res.send(records);
});


router.get('/getRecordsByLocalHl', async function (req, res) {
    if (req.query.LocalHl) {
        let result = await sv_db.getRecordsByLocalHl(req.query.LocalHl);
        if (result) {
            res.send(result);
        } else {
            res.status(400).json({
                'message': 'error',
                'description': 'No content for this user or no access for this system!'
            })
        }
    } else {
        res.status(400).json({'message': 'error', 'description': 'Partial Content. Not enough data!'})
    }
});

router.get('/getRecordsByGenre', async function (req, res) {
    if (req.query.LocalHl && req.query.genre) {
        let result = await sv_db.getRecordsByGenre(req.query.LocalHl, req.query.genre);
        if (result) {
            res.send(result);
        } else {
            res.status(400).json({
                'message': 'error',
                'description': 'No content for this user or no access for this system!'
            })
        }
    } else {
        res.status(400).json({'message': 'error', 'description': 'Partial Content. Not enough data!'})
    }
});

router.get('/deleteRecord', async function (req, res) {
    if (req.query.gameUrl) {
        await sv_db.deleteRecord(req.query.gameUrl);
        let records = await sv_db.getRecordsArray();
        res.send(records);
    } else {
        res.status(400).json({'message': 'error', 'description': 'Partial Content. Not enough data!'})
    }
});

router.get('/content/getAllByLocalHl', async function (req, res) {
    if (req.query.LocalHl) {
        let mains = await sv_db.getMainByLocalHl(req.query.LocalHl);
        let catalog = await sv_db.getCatalogByLocalHl(req.query.LocalHl);
        let result = await sv_db.getRecordsByLocalHl(req.query.LocalHl);

        if (result || mains || catalog) {
            let answer = {
                "labels": mains,
                "games": result,
                "catalog": catalog
            }
            res.send(answer);
        } else {
            res.status(400).json({
                'message': 'error',
                'description': 'No content for this user or no access for this system!'
            })
        }
    } else {
        res.status(400).json({'message': 'error', 'description': 'Partial Content. Not enough data!'})
    }
});

module.exports = router;
