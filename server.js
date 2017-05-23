const express = require("express");
const app = express();

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/url_shortener";

MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    console.log("Connected to database.");
    db.close();
});

app.connect(process.env.PORT || 3000, () => {
    console.log(`Connected to port ${process.env.PORT || 3000}.`);
});
