"use strict";
const express = require("express");
const validator = require("validator");
const app = express();

const MongoClient = require("mongodb").MongoClient;

app.get(["/new*", "/new"], (req, res) => {
    const url = req.path.substr(5);
    if (validator.isURL(url, {require_protocol: true})) {
        MongoClient.connect(process.env.MONGODB_URL, (err, db) => {
            if (err) throw err;

            const urls = db.collection("urls");
            let alreadyExists = false;
            let foundAt = -1;
            urls.find({}).forEach((x) => { if (x.url === url) alreadyExists = true; foundAt = x.index; console.log(x) }, (err) => {
                if (err) throw err;

                if (!alreadyExists) {
                    urls.count({}, (err, result) => {
                        if (err) throw err;

                        urls.insertOne({url: url, index: result + 1}, (err) => {
                            if (err) throw err;

                            db.close();
                            res.send({
                                original_url: url,
                                shortened_url: `${process.env.BASE_URL}/${result + 1}`
                            });
                        });
                    });
                } else {
                    res.send({
                        original_url: url,
                        shortened_url: `${process.env.BASE_URL}/${foundAt}`
                    });
                }
            });
        });
    } else {
        res.send({error: "Invalid URL"});
    }
});

app.get("/", (req, res) => {
    const index = [];
    MongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;
        
        db.collection("urls").find({}).forEach((x) => index.push(x), (err) => {
            if (err) throw err;

            db.close();
            res.send(index);
        });
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Connected to port ${process.env.PORT}.`);
});
