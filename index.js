const express = require("express");
const db = require("./db");
const app = express();

let cuteAnimals = [
    {
        name: "giraffe",
        cutenessScore: 7,
    },
    { name: "capybara", cutenessScore: 10 },
    { name: "quokka", cutenessScore: 10 },
    { name: "penguin", cutenessScore: 12 },
];

app.get("/get-images", (req, res) => {
    db.getImages().then(({ rows }) => {
        res.json({ rows });
    });
    // res.json({
    //     cuteAnimals,
    // });
});

app.use(express.static("public"));

app.listen(8080, () => console.log("listening on port 8080"));
