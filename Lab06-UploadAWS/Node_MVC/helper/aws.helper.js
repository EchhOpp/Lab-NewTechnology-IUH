const AWS = require('aws-sdk');

const config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const tableName = "table_default"

module.exports = {
    tableName,
    docClient,
    s3
}