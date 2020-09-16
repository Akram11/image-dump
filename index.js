const express = require("express");
const db = require("./db");
const app = express();
const s3 = require("./s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/public/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.static("public"));
// app.use(express.json());

app.post("/upload", uploader.single("file"), (req, res) => {
    // req.file gives you access to your file
    // req.body gives you access to the user input

    if (req.file) {
        let { path } = req.file;
        path = "." + path.slice(path.indexOf("/uploads"), path.length);
        const { title, description, username } = req.body;
        db.insertImage(path, title, description, username).then(({ rows }) => {
            res.json({
                success: true,
                rows,
            });
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.get("/get-images", (req, res) => {
    db.getImages().then(({ rows }) => {
        res.json({ rows });
    });
});

app.listen(8080, () => console.log("listening on port 8080"));
