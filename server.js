const express = require("express");
const app = express();

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(process.env.MONGODB_URL, (err, db) => {
    if (err) throw err;
    console.log("Connected to database.");
    db.close();
});

app.connect(process.env.PORT, () => {
    console.log(`Connected to port ${process.env.PORT}.`);
});
