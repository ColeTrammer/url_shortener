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
            let foundAt = -1;
            let count = 0;
            urls.find({}).forEach((x) => {
                if (x.url === url) {
                    foundAt = x.index;
                }
                count++;
            }, (err) => {
                if (err) throw err;

                if (foundAt < 0) {
                    urls.insertOne({url: url, index: count + 1}, (err) => {
                        if (err) throw err;

                        db.close();
                        res.send({
                            original_url: url,
                            shortened_url: `${process.env.BASE_URL}/${count + 1}`
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

app.get("/:index", (req, res) => {
    const index = parseInt(req.params.index, 10);
    MongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;

        db.collection("urls").find({index: index}).toArray((err, documents) => {
            if (err) throw err;

            if (documents.length) {
                res.redirect(documents[0].url);
            } else {
                res.send({error: "Invalid shortened url"});
            }
        });
    });
});

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(process.env.PORT, () => {
    console.log(`Connected to port ${process.env.PORT}.`);
});
