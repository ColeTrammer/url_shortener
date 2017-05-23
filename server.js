const express = require("express");
const app = express();

const MongoClient = require("mongodb").MongoClient;

app.get("/", (req, res) => {
    MongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;
        console.log("Connected to database.");
        db.close();
    });
    res.send("");
});

app.listen(process.env.PORT, () => {
    console.log(`Connected to port ${process.env.PORT}.`);
});
