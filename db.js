const spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/images"
);

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY id DESC
                     LIMIT 5;`);
};

module.exports.insertImage = (url, username, title, description) => {
    return db.query(
        `INSERT INTO images 
        (url, username, title, description) VALUES ($1, $2, $3, $4)
        RETURNING * 
    `,
        [url, username, title, description]
    );
};

module.exports.getImage = (id) => {
    return db.query(`SELECT * FROM images where id = $1`, [id]);
};

module.exports.getComments = (image_id) => {
    return db.query(
        ` SELECT * FROM comments where image_id = $1 ORDER BY id DESC`,
        [image_id]
    );
};

module.exports.addComment = (username, comment, image_id) => {
    return db.query(
        `INSERT INTO comments
        (username, comment, image_id)
        VALUES
        ($1, $2, $3) RETURNING *`,
        [username, comment, image_id]
    );
};

module.exports.getMoreImages = (lowerstId) => {
    return db.query(
        `SELECT url, title, id, (
                    SELECT id FROM images
                    ORDER BY id ASC
                    LIMIT 1
                    ) AS "lowestId" FROM images
                    WHERE id < $1
                    ORDER BY id DESC
                    LIMIT 1;
                    `,
        [lowerstId]
    );
};
