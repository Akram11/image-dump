const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    const { filename, mimetype, size, path } = req.file;

    const proimse = s3
        .putObject({
            Bucket: "imagesdump",
            ACL: "public-read",
            key: filename,
            Body: fs.createReadStream(path),
            contentType: mimetype,
            ContentLength: size,
        })
        .promise();
};
