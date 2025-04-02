const AWS = require('aws-sdk');

const config = new AWS.Config({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'ap-southeast-2',
});

AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const tableName = "SaiGonCar";

module.exports = {
    docClient,
    s3,
    tableName,
}