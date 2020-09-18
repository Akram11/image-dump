const express = require("express");
const db = require("./db");
const app = express();
const s3 = require("./s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const { s3Url } = require("./config.json");

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
app.use(express.json());

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // req.file gives you access to your file
    // req.body gives you access to the user input
    if (req.file) {
        const { title, description, username } = req.body;
        let { filename } = req.file;

        // path = "." + path.slice(path.indexOf("/uploads"), path.length);
        const url = `${s3Url}${filename}`;
        db.insertImage(url, title, description, username)
            .then(({ rows }) => {
                res.json({
                    success: true,
                    rows,
                });
            })
            .catch((err) => {
                console.log("error uploading image", err);
                res.status(500).send("Something broke!");
            });
    } else {
        res.json({
            success: false,
        });
    }
});

app.get("/get-images", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            res.json({ rows });
        })
        .catch((err) => {
            console.error("error getting images", err);
            res.status(500).send("Something broke!");
        });
});

app.get("/get-images/:imageId", (req, res) => {
    db.getImage(req.params.imageId)
        .then(({ rows }) => {
            res.json({ rows });
        })
        .catch((err) => {
            console.error("error getting clicked image", err);
            res.status(500).send("Something broke!");
        });
});

app.get("/get-more/:lowerstId", (req, res) => {
    db.getMoreImages(req.params.lowerstId)
        .then(({ rows }) => {
            res.json({ rows });
        })
        .catch((err) => {
            console.error("error getting more images", err);
            res.status(500).send("Something broke!");
        });
});

app.get("/get-images/:imageId/comments", (req, res) => {
    db.getComments(req.params.imageId)
        .then(({ rows }) => {
            res.json({ rows });
        })
        .catch((err) => {
            console.error("error getting comments", err);
            res.status(500).send("Something broke!");
        });
});

app.post("/comment", (req, res) => {
    let { username, comment, imageId } = req.body;
    db.addComment(username, comment, imageId)
        .then(({ rows }) => {
            res.json({ rows });
        })
        .catch((err) => {
            console.error("error adding comment", err);
            res.status(500).send("Something broke!");
        });
});

app.listen(8080, () => console.log("listening on port 8080"));
