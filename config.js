const fs = require('fs');
const path = require('path');
const moment = require("moment");
const filePath = path.join(__dirname, './data/sleepRecords.json');

// Function to read the JSON file
const readSleepRecords = () => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Function to write to the JSON file
const writeSleepRecords = (records) => {
    fs.writeFileSync(filePath, JSON.stringify(records, null, 2), 'utf8');
};

const validateSleepRecord = (record) => {
    const { userId, hours, timestamp } = record;
   
    const userIdValid = typeof userId === 'string' && userId.trim() !== '';
    const hoursValid = typeof hours === 'number' && hours >= 0;
    const timestampValid = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(timestamp);
    return userIdValid && hoursValid && timestampValid;
};

module.exports = { readSleepRecords, writeSleepRecords, validateSleepRecord };
