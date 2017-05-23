const express = require("express");
const app = express();

app.connect(process.env.PORT || 3000, () => {
    console.log(`Connected to port ${process.env.PORT || 3000}`);
});
