
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const { readSleepRecords, writeSleepRecords,validateSleepRecord} = require('./config.js');
const moment = require('moment');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/sleep', (req, res) => {
    const userId=req.body.userId;
    const hours=req.body.hours;
    const timestamp = req.body.timestamp;
    
    if (!validateSleepRecord(req.body)) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    const sleepRecords = readSleepRecords();
    const newRecord = { id: uuidv4(),userId: userId,  hours:hours,timestamp: timestamp };
    
    sleepRecords.push(newRecord);
    
    writeSleepRecords(sleepRecords);

    res.status(201).json(newRecord);
});

app.get('/sleep/:userId', (req, res) => {
    const { userId } = req.params;
    const sleepRecords = readSleepRecords();
    const userRecords = sleepRecords.filter(record => record.userId === userId)
    userRecords.sort((a, b) =>  moment(a.timestamp) - moment(b.timestamp));
    res.status(200).json(userRecords);
});

app.delete('/sleep/:recordId', (req, res) => {
    const { recordId } = req.params;
    const sleepRecords = readSleepRecords();
    const index = sleepRecords.findIndex(record => record.id === recordId);

    if (index !== -1) {
        const deletedRecord = sleepRecords.splice(index, 1)[0];
        writeSleepRecords(sleepRecords);
        res.status(200).json(deletedRecord);
    } else {
        res.status(404).json({ error: 'Record not found' });
    }
});

app.put('/sleep/:recordId', (req, res) => {
    const { recordId } = req.params;
    const { userId, hours, timestamp } = req.body;

    if (!validateSleepRecord(req.body)) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    const sleepRecords = readSleepRecords();
    const index = sleepRecords.findIndex(record => record.id === recordId);
       console.log(sleepRecords[index]);
    if (index !== -1) {
        const updatedRecord = { ...sleepRecords[index], userId, hours, timestamp };
        sleepRecords[index] = updatedRecord;
        writeSleepRecords(sleepRecords);
        res.status(200).json(updatedRecord);
    } else {
        res.status(404).json({ error: 'Record not found' });
    }
});
module.exports = app;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
